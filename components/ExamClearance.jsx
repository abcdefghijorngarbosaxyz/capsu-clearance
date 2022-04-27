import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ExamClearance({ period, session, signatures }) {
  const [clearance, setClearance] = useState({});
  const [signature, setSignature] = useState("");
  const getStatus = async () => {
    const { data } = await axios.post("/api/student/status", {
      studentid: session.id,
    });
    if (data) setClearance(data);
  };
  const getSignature = async () => {
    const { data } = await axios.post("/api/student/signature", {
      studentid: session.id,
    });
    if (data) setSignature(data.signature);
  };
  useEffect(() => {
    getStatus();
    getSignature();
  }, []);
  return (
    <div
      id="clearancedoc"
      className="h-fit w-fit border border-black bg-white font-serif text-2xs text-black"
    >
      <div className="flex h-[5rem] w-[22.9rem] border-b border-black">
        <div className="h-full w-[3.9rem] border-r border-black py-2">
          <div className="relative flex h-full w-full">
            <Image
              priority
              src="/assets/capsu-logo.png"
              layout="fill"
              objectFit="fixed"
            />
          </div>
        </div>
        <div className="h-full w-[9.5rem] border-r border-black">
          <div className="h-[3rem] w-full border-b border-black">
            <div className="flex h-[1rem] w-full items-center">
              <h6 className="px-[0.1rem]">Document Type: </h6>
            </div>
            <div className="flex h-[1rem] w-full items-center justify-center">
              <h6 className="px-[0.1rem] font-bold">FORM</h6>
            </div>
            <div className="flex h-[1rem] w-full items-center justify-center">
              <h6 className="px-[0.1rem]">ISO 9001-2015</h6>
            </div>
          </div>
          <div className="h-[2rem] w-full">
            <div className="flex h-[1rem] w-full items-center">
              <h6 className="px-[0.1rem]">Document Title: </h6>
            </div>
            <div className="flex h-[1rem] w-full items-center justify-center">
              <h6 className="px-[0.1rem] font-bold">EXAMINATION CLEARANCE</h6>
            </div>
          </div>
        </div>
        <div className="h-full w-[5.4rem] border-r border-black">
          <div className="h-[3rem] w-full border-b border-black">
            <div className="flex h-[1rem] w-full items-center justify-end border-b border-black">
              <h6 className="px-[0.1rem]">Document Code: </h6>
            </div>
            <div className="flex h-[1rem] w-full items-center justify-end border-b border-black">
              <h6 className="px-[0.1rem]">Revision No.: </h6>
            </div>
            <div className="flex h-[1rem] w-full items-center justify-end">
              <h6 className="px-[0.1rem]">Effective Date: </h6>
            </div>
          </div>
          <div className="flex h-[2rem] w-full items-center justify-end">
            <h6 className="px-[0.1rem]">Page: </h6>
          </div>
        </div>
        <div className="h-full w-[4.1rem]">
          <div className="h-[3rem] w-full border-b border-black">
            <div className="flex h-[1rem] w-full items-center justify-center border-b border-black">
              <h6 className="px-[0.1rem] font-semibold">REG-F07</h6>
            </div>
            <div className="flex h-[1rem] w-full items-center justify-center border-b border-black">
              <h6 className="px-[0.1rem] font-semibold">05</h6>
            </div>
            <div className="flex h-[1rem] w-full items-center justify-center">
              <h6 className="px-[0.1rem] font-semibold">June 25, 2018</h6>
            </div>
          </div>
          <div className="flex h-[2rem] w-full items-center justify-center">
            <h6 className="px-[0.1rem] font-semibold">1 of 1</h6>
          </div>
        </div>
      </div>
      <div className="h-fit w-[22.9rem] p-2 text-sm">
        <h6>
          <span>{period.term === "Midterm" ? "(x)" : "( )"}</span>&nbsp;Mid-Term
        </h6>
        <h6>
          <span>{period.term === "Final" ? "(x)" : "( )"}</span>&nbsp;Final
        </h6>
        <h6 className="mt-2">
          Name:{" "}
          <span className="underline">
            {session.firstname}&nbsp;{session.middlename.charAt(0)}.&nbsp;
            {session.lastname}
          </span>
        </h6>
        <h6>
          Course &amp; Year:{" "}
          <span className="underline">
            {session.department}-{session.yearlevel}
          </span>
        </h6>
        <div className="flex">
          <h6>Current Enrollment: </h6>
          <div>
            <h6>
              {period.semester === 1 ? (
                <span>
                  (x) 2nd Sem, AY{" "}
                  <span className="underline">
                    {period.schoolyear + "-" + (period.schoolyear + 1)}
                  </span>
                </span>
              ) : (
                "( ) 1st Sem, AY"
              )}
            </h6>
            <h6>
              {period.semester === 2 ? (
                <span>
                  (x) 2nd Sem, AY{" "}
                  <span className="underline">
                    {period.schoolyear - 1 + "-" + period.schoolyear}
                  </span>
                </span>
              ) : (
                "( ) 1st Sem, AY"
              )}
            </h6>
            <h6>{period.semester === 0 ? "(x)" : "( )"}&nbsp;Summer, AY</h6>
          </div>
        </div>
        <div className="flex h-[3rem] w-full">
          <div className="flex w-[7rem] items-end">
            Student&apos;s Signature:
          </div>
          <div className="relative flex h-full w-[14.9rem] items-end justify-center border-b border-black">
            {signature && (
              <div className="absolute top-0 left-[2rem]">
                <div className="relative h-[4rem] w-[10rem]">
                  <Image src={signature} layout="fill" objectFit="contain" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h6>
            Date:{" "}
            <span className="underline">
              {new Date(session.applieddate).toLocaleDateString()}
            </span>
          </h6>
        </div>
        <div className="relative h-[4rem] w-full px-[4rem]">
          <div className="h-[3rem] border-b border-black"></div>
          <div className="flex h-[1rem] justify-center">
            <h6>(Dean / Program Chair)</h6>
          </div>
          {clearance.department && clearance.department.signed === "Signed" && (
            <div className="absolute top-0 left-[3rem]">
              <div className="relative h-[4rem] w-[10rem]">
                <Image
                  src={signatures.department}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}
        </div>
        <div className="relative h-[4rem] w-full px-[4rem]">
          <div className="h-[3rem] border-b border-black"></div>
          <div className="flex h-[1rem] justify-center">
            <h6>(Chairman, Student Affairs)</h6>
          </div>
          {clearance.affairs && clearance.affairs.signed === "Signed" && (
            <div className="absolute top-0 left-[3rem]">
              <div className="relative h-[4rem] w-[10rem]">
                <Image
                  src={signatures.affairs}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}
        </div>
        <div className="relative h-[4rem] w-full px-[4rem]">
          <div className="h-[3rem] border-b border-black"></div>
          <div className="flex h-[1rem] justify-center">
            <h6>(Librarian</h6>
          </div>
          {clearance.library && clearance.library.signed === "Signed" && (
            <div className="absolute top-0 left-[3rem]">
              <div className="relative h-[4rem] w-[10rem]">
                <Image
                  src={signatures.library}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}
        </div>
        <div className="relative h-[4rem] w-full px-[4rem]">
          <div className="h-[3rem] border-b border-black"></div>
          <div className="flex h-[1rem] justify-center">
            <h6>(Collecting &amp; Disbursing Officer)</h6>
          </div>
          {clearance.collection && clearance.collection.signed === "Signed" && (
            <div className="absolute top-0 left-[3rem]">
              <div className="relative h-[4rem] w-[10rem]">
                <Image
                  src={signatures.collecting}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}
        </div>
        <div className="relative h-[4rem] w-full px-[4rem]">
          <div className="h-[3rem] border-b border-black"></div>
          <div className="flex h-[1rem] justify-center">
            <h6>(Registrar)</h6>
          </div>
          {clearance.registrar && clearance.registrar.signed === "Signed" && (
            <div className="absolute top-0 left-[3rem]">
              <div className="relative h-[4rem] w-[10rem]">
                <Image
                  src={signatures.registrar}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
