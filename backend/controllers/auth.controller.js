import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";




// ***************************************************************************************
// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
// Store tokens in redisDB
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    // prevent XSS attacks(cross site request forgery attacks)
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 *1000,
  });
  res.cookie("refreshToken", refreshToken, {
    // prevent XSS attacks(cross site request forgery attacks)
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 *1000,
  });
};

// Sign up
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  // check if user exists
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    // User Authentication
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in sign up controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
// Login
export const login = async (req, res) => {
  try {
    // console.log("Here runs the login");
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log("Here runs the login2");

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else{
      res.status(401).json({message:"inavalid email or password"});
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({message:error.message})
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged Out Successfully" });
  } catch (error) {
        console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const refreshToken = async (req,res) => {
 try {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken) {
    return res.status(401).json({message: "No Refres token provided"});
    
   }
   const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
   const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

   if (storedToken !== refreshToken) {
    return res.status(401).json({message: "Invalid refresh token"})
    
   }
   const accessToken = jwt.sign({userId: decoded. userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});

   res.cookie("accessToken", accessToken, {
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,

   });
   res.json({message: "Token refreshed Successfully"});
 } catch (error) {
  console.log ("Error in refreshToken controller", error.message)
  res.status(500).json({message:"Server error", error:error.message})
 } 
}

// Get Profile Fn
export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};