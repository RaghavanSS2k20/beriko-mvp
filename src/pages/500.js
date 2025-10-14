import ErrorPage from "@/components/error/errorComponent";
export default function Custom500() {
  return (
    <ErrorPage
      statusCode={500}
      title="Server Error"
      description="Something went wrong on our side. Please try again later."
    />
  );
}
