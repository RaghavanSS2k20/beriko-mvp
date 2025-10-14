import ErrorPage from "@/components/error/errorComponent";
export default function Custom404() {
  <ErrorPage
    statusCode={404}
    title="Lost Connection?"
    description="Looks like this page ghosted us… but don’t worry, I’m right here. Let’s swipe back to somewhere fun!"
  />;
}
