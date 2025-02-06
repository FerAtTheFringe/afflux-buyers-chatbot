export let assistantId = ""; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_WEB_ASSISTANT_ID;
}
