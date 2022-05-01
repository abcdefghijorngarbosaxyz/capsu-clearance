import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dbconnect from "../lib/dbconnect";
import TopBar from "../components/TopBar";
import Spinner from "../components/extras/Spinner";
import axios from "axios";
import platform from "platform";

export default function Home({ session }) {
  const router = useRouter();
  const [adminid, setAdminId] = useState(session.id);

  const authenticateUser = () => {
    if (session.role === "Student") {
      logInPlatform();
      router.push("/student/v2/" + session.id);
    }
    if (session.role === "Admin" && session.office !== "Department") {
      logInPlatform();
      router.push("/admin/" + session.department.toLowerCase());
    }
    if (session.role === "Admin" && session.office === "Department") {
      logInPlatform();
      router.push("/admin/dean/" + session.department.toLowerCase());
    }
  };

  const logInPlatform = async () => {
    const { data: platforminfo } = await axios.get(
      "https://api.ipregistry.co/?key=mejrmfu6hkc8m00a"
    );
    const { ip, location, time_zone, user_agent } = platforminfo;

    await axios.post("/api/account/security/platformhistory", {
      userid: session.id,
      role: session.role ? session.role : null,
      ipaddr: ip,
      browser: user_agent.name,
      os: user_agent.os.name,
      location:
        (location.city ? location.city : "Unknown City") +
        ", " +
        location.country.name,
      when: time_zone.current_time,
    });
    const { data } = await axios.post("/api/account/security/check2fac", {
      adminid,
    });
    if (data.twofactor.enabled) {
      const rd = localStorage.getItem(session.username);
      if (rd === "rd" || rd === "temp") {
        return;
      } else {
        router.push(
          `/account/security/2fac/verify?email=${data.twofactor.email}`
        );
      }
    } else return;
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <div>
      <Head>
        <title>Checking Authentication</title>
      </Head>
      <TopBar />
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner color="bg-blue-500/50" />
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;
  await dbconnect();
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  } else {
    return {
      props: {
        session,
      },
    };
  }
};
