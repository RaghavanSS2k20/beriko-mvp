export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/hi",
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
