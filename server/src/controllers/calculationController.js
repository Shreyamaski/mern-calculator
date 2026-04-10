import { Calculation } from "../models/Calculation.js";

export const createCalculation = async (request, response) => {
  try {
    const { expression, result, theme } = request.body;

    if (!expression || result === undefined || result === null) {
      return response.status(400).json({
        message: "Expression and result are required."
      });
    }

    const calculation = await Calculation.create({
      expression,
      result: String(result),
      theme: theme || "dark"
    });

    return response.status(201).json(calculation);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to save calculation history.",
      error: error.message
    });
  }
};

export const getCalculations = async (_request, response) => {
  try {
    const calculations = await Calculation.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return response.json(calculations);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to fetch calculation history.",
      error: error.message
    });
  }
};

export const deleteCalculation = async (request, response) => {
  try {
    const deletedCalculation = await Calculation.findByIdAndDelete(request.params.id);

    if (!deletedCalculation) {
      return response.status(404).json({
        message: "Calculation not found."
      });
    }

    return response.json({
      message: "Calculation removed successfully."
    });
  } catch (error) {
    return response.status(500).json({
      message: "Unable to delete calculation.",
      error: error.message
    });
  }
};

export const clearCalculations = async (_request, response) => {
  try {
    await Calculation.deleteMany({});

    return response.json({
      message: "All calculation history removed successfully."
    });
  } catch (error) {
    return response.status(500).json({
      message: "Unable to clear history.",
      error: error.message
    });
  }
};
