import Head from "next/head";
import Link from "next/link";
import TopBar from "../../components/TopBar";

export default function HowTo() {
  return (
    <div className="flex h-fit w-full justify-center">
      <Head>
        <title>How to</title>
      </Head>
      <TopBar />
      <div className="prose-slate-700 prose mt-20 h-fit w-full dark:prose-invert">
        <div>
          <h1>How to?</h1>
        </div>
        <div id="signature-upload">
          <h2>Upload signature</h2>
          <ol>
            <li>Take a photo of your signature in a white piece of paper.</li>
            <li>
              Upload the photo of your signature to{" "}
              <Link href="https://www.remove.bg/">remove.bg</Link>. This will
              remove the white background in the photo you uploaded leaving only
              the signature.
            </li>
            <li>
              Download the PNG file generated in the{" "}
              <Link href="https://www.remove.bg/">remove.bg</Link> website.
            </li>
            <li>
              Go <Link href="/">back</Link> and upload the PNG file with your
              signature in the settings page.
            </li>
          </ol>
          <i>
            <p>
              It is important that you upload only a PNG file to maintain the
              transparent background of photo.
            </p>
          </i>
        </div>
      </div>
    </div>
  );
}
