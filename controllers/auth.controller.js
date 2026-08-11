import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import validator from "validator" 


async function signUp(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      companyLogo,
    } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      })
    }

    // Employers must provide a company logo 
    if (role === "Employer" && !companyLogo){
      return res.status(400).json({
        message: "Company logo URL is required for Employers.",
      })
    }

    // Validate company logo URL 

    if (companyLogo && !validator.isURL(companyLogo)){
      return res.status(400).json({
        message: "Please provide a valid company logo URL. "
      })
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      })
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists.",
      })
    }

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword: await bcrypt.hash(password, 12),
      role,
      phone: phone?.trim(),
      companyLogo: companyLogo?.trim(), 
    })

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyLogo: user.companyLogo,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      })
    }

    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email already exists.",
      })
    }

    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}


async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      })
    }

  
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    )

    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        companyLogo: user.companyLogo,
      },
    })
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}


async function verifyUser(req, res) {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      })
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyLogo: user.companyLogo,
      },
    })
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export {
  signUp,
  signIn,
  verifyUser,
};