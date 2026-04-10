import mongoose from "mongoose";

const calculationSchema = new mongoose.Schema(
  {
    expression: {
      type: String,
      required: true,
      trim: true
    },
    result: {
      type: String,
      required: true,
      trim: true
    },
    theme: {
      type: String,
      enum: ["dark", "sunset"],
      default: "dark"
    }
  },
  {
    timestamps: true
  }
);

export const Calculation = mongoose.model("Calculation", calculationSchema);
