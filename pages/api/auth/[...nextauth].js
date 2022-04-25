import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import dbconnect from "../../../lib/dbconnect";
import Admin from "../../../models/Admin";
import Student from "../../../models/Student";

const nextAuthOptions = (req, res) => {
  var persist = req.body.persist;
  return {
    providers: [
      CredentialProvider({
        name: "credentials",
        authorize: async (credentials) => {
          const { username, password, role } = credentials;
          await dbconnect();

          var user;
          if (role === "Admin") user = await Admin.login(username, password);
          if (role === "Student")
            user = await Student.login(username, password);
          if (user) return user;
          return null;
        },
      }),
    ],
    callbacks: {
      jwt: ({ token, user }) => {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.firstname = user.firstname;
          token.lastname = user.lastname;
          token.username = user.username;
          token.department = user.department;
          token.userphoto = user.userphoto;
          token.yearlevel = user.yearlevel;
          token.section = user.section;
          token.middlename = user.middlename;
          token.office = user.office;
          token.applieddate =
            user.role === "Admin" ? null : user.applied.appliedDate;
        }

        return token;
      },
      session: ({ session, token, user }) => {
        if (token) {
          session.id = token.id;
          session.role = token.role;
          session.firstname = token.firstname;
          session.lastname = token.lastname;
          session.username = token.username;
          session.department = token.department;
          session.userphoto = token.userphoto;
          session.yearlevel = token.yearlevel;
          session.section = token.section;
          session.office = token.office;
          session.middlename = token.middlename;
          session.applieddate = token.applieddate;
        }

        return session;
      },
    },
    session: {
      maxAge: persist ? 60 * 60 * 24 * 30 : 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true,
    },
    pages: {
      signIn: "/signin",
      error: "/signin",
    },
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
