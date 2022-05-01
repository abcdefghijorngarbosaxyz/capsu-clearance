import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "Admin",
  },
  username: {
    type: String,
    required: true,
    minlength: 8,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  office: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  userphoto: {
    type: String,
    default: null,
  },
  twofactor: {
    enabled: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      default: null,
    },
  },
  loginHistory: [
    {
      browser: {
        type: String,
      },
      os: {
        type: String,
      },
      location: {
        type: String,
      },
      ipaddr: {
        type: String,
      },
      when: {
        type: Date,
      },
    },
  ],
});

AdminSchema.pre("save", async function (next) {
  this.password = await bcryptjs.hash(this.password, await bcryptjs.genSalt());
  next();
});

AdminSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcryptjs.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("CredentialsSignin");
  }
  throw Error("CredentialsSignin");
};

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
