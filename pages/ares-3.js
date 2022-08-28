import BaseLayout from "../components/BaseLayout";
import BlogHeader from "../components/BlogHeader";

function Ares3() {
  return (
    <BaseLayout>
      <h2>Ares 3</h2>
      <p>
        These are the Substack articles I have posted on Ares 3: Exploration log
        entries. Here I post stuff that I explore out of curiosity, which is not
        restricted to just programming.
      </p>
      <br />
      <BlogHeader
        title="LOG ENTRY: SOL 1"
        publishedOn="28th August 2022"
        href="https://saranshabd.substack.com/p/log-entry-sol-1"
      />
    </BaseLayout>
  );
}

export default Ares3;
