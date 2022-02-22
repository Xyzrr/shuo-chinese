import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";
import { Storage } from "@google-cloud/storage";
import { extractCards } from "./src/card-utils";

const client = new textToSpeech.TextToSpeechClient();
const storage = new Storage();
const bucket = storage.bucket("gs://shuo-chinese-audio-samples");

const genAudioForText = async (text: string) => {
  console.log("Synthesizing text:", text);

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech({
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "cmn-CN", name: "cmn-CN-Wavenet-A" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  });

  console.log("Synthesized!");

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  const fname = `audio/${text}.mp3`;
  await writeFile(fname, response.audioContent as string, "binary");
  console.log(`Wrote to file!`);

  await bucket.upload(fname);
  console.log(`Uploaded!`);

  // fs.unlinkSync(fname);
  // console.log("Cleaned up!");
};

const genAudioForCard = async (card: any) => {
  const text = card.chineseWords.map((w: any) => w.chars).join("");
  await genAudioForText(text);
};

const genAudio = async () => {
  const cards = extractCards(2);
  for (const card of cards) {
    if (card.multi) {
      for (const example of card.children) {
        await genAudioForCard(example);
      }
    } else {
      await genAudioForCard(card);
    }
  }
};

genAudio();
