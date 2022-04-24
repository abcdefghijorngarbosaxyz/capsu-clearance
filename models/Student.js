import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const StudentSchema = new mongoose.Schema({
  role: {
    type: String,
    immutable: true,
    default: "Student",
  },
  username: {
    type: String,
    required: true,
    minlength: 11,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  firstname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  applied: {
    isApplied: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    appliedDate: {
      type: Date,
      default: new Date(),
    },
  },
  office: {
    type: String,
    default: "Student",
    immutable: true,
  },
  userphoto: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    required: true,
  },
  yearlevel: {
    type: Number,
    required: true,
    maxlength: 1,
  },
  section: {
    type: String,
    default: "?",
    uppercase: true,
    maxlength: 1,
  },
  notifications: [
    {
      notificationOffice: {
        type: String,
        default: null,
      },
      notificationMessage: {
        type: String,
        default: null,
      },
      notificationDate: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  status: [
    {
      schoolyear: {
        type: Number,
        default: 2022,
      },
      semester: {
        type: Number,
        default: 1,
      },
      term: {
        type: String,
        default: "Midterm",
      },
      status: {
        registrar: {
          signed: {
            type: String,
            default: "Pending",
          },
          signedDate: {
            type: Date,
            default: 0,
          },
          signedBy: {
            type: String,
            default: "",
          },
        },
        department: {
          signed: {
            type: String,
            default: "Pending",
          },
          signedDate: {
            type: Date,
            default: 0,
          },
          signedBy: {
            type: String,
            default: "",
          },
        },
        collection: {
          signed: {
            type: String,
            default: "Pending",
          },
          signedDate: {
            type: Date,
            default: 0,
          },
          signedBy: {
            type: String,
            default: "",
          },
        },
        library: {
          signed: {
            type: String,
            default: "Pending",
          },
          signedDate: {
            type: Date,
            default: 0,
          },
          signedBy: {
            type: String,
            default: "",
          },
        },
        affairs: {
          signed: {
            type: String,
            default: "Pending",
          },
          signedDate: {
            type: Date,
            default: 0,
          },
          signedBy: {
            type: String,
            default: "",
          },
        },
      },
    },
  ],
});

StudentSchema.pre("save", async function (next) {
  this.password = await bcryptjs.hash(this.password, await bcryptjs.genSalt());
  next();
});

StudentSchema.statics.login = async function (username, password) {
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

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
