import { Elysia, t } from "elysia";
import wppconnect from "@wppconnect-team/wppconnect";

let wppClient: wppconnect.Whatsapp | null = null;

await wppconnect
  .create({
    session: "my-session",
  })
  .then((client) => {
    console.log("WPPConnect client is ready!");

    wppClient = client;
  })
  .catch((error) => {
    console.error(error);

    return null;
  });

const app = new Elysia().get("/", () => "Hello Elysia").listen(8080);

app.post(
  "/send-message",
  async ({ body }) => {
    if (!wppClient) {
      return { error: "WPPConnect client is not ready yet." };
    }

    console.log(`Sending message to ${body.phone}: ${body.message}`);

    await wppClient
      .sendText(body.phone, body.message)
      .then((result) => {
        console.log("Result: ", result); //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
  },
  {
    body: t.Object({
      phone: t.String(),
      message: t.String(),
    }),
  }
);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
