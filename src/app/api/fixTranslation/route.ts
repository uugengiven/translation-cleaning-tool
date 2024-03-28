// app/api/fixTranslation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";
import { BookSection, FixedTranslation, Book } from '@/data/models';
import { Op } from 'sequelize';
import { SYSTEM_PROMPT, CHAIN, MODEL_MEDIUM, SYSTEM_PROMPT_INSTRUCTIONS } from '@/ai/consts';
import { MessageParam, Message, ContentBlock } from '@anthropic-ai/sdk/resources/messages.mjs';

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const isEditable = process.env.NEXT_PUBLIC_ALLOW_EDIT === 'true';
  if(!isEditable) {
    return NextResponse.json({ error: 'Editing is disabled' }, { status: 403 });
  }
  const { sectionId } = await request.json();


  const currentSection = await BookSection.findByPk(sectionId, {
    include: [FixedTranslation],
  });

  if (!currentSection) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  const currentBook = await Book.findByPk(currentSection.bookId);
  if(!currentBook) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const previousSection = await BookSection.findOne({
    where: {
      bookId: currentSection.bookId,
      sectionNumber: currentSection.sectionNumber - 1,
    },
    include: FixedTranslation,
  });

    let messageContent = "";


  if (previousSection) {
    const previousTranslation = previousSection.FixedTranslations?.find(
      (translation) => translation.active
    );

    console.log("previous section", previousSection);
    console.log("previous translation", previousTranslation);

    messageContent = `<prev><original>${previousSection.content}</original><rewrite>${previousTranslation?.content || ''}</rewrite></prev><current><original>${currentSection.content}</original></current>`;
  } else {
    messageContent = `<current><original>${currentSection.content}</original></current>`;
  }

  const messages: (MessageParam|Message)[] = [];

  //return NextResponse.json({ message: 'Translation fixed successfully' });

  for(let i = 0; i < CHAIN.length; i++) {
    const instruction = i === 0? messageContent + "\n\n" + CHAIN[i].replace("<<style>>", currentBook.description) : CHAIN[i].replace("<<style>>", currentBook.description);
    console.log("instruction", instruction);
    console.log("adding instruction");
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: messageContent + "\n" + instruction,
        },
      ],
    });

    const systemPrompt = SYSTEM_PROMPT + currentBook.info + "\n\n" + SYSTEM_PROMPT_INSTRUCTIONS;
    console.log("system prompt", systemPrompt);
    const response = await anthropic.messages.create({
      model: MODEL_MEDIUM,
      max_tokens: 2001,
      temperature: 0.6,
      system: systemPrompt,
      messages,
    });

    console.log("back from server", response);
    console.log("adding response");
    messages.push({role: response.role, content: response.content});
  }

  const translationContent = (messages[messages.length - 1].content[0] as ContentBlock).text.match(/<rewrite>.*<\/rewrite>/gms);
  const content = translationContent?.[0].replace("<rewrite>", '').replace("</rewrite>", '').trim();

  const fixedTranslation = await FixedTranslation.create({
    bookSectionId: currentSection.id,
    content: content,
    active: true,
  });

  await FixedTranslation.update(
    { active: false },
    {
      where: {
        bookSectionId: currentSection.id,
        id: {
          [Op.ne]: fixedTranslation.id,
        },
      },
    }
  );

  return NextResponse.json({ message: 'Translation fixed successfully' });
}