const mongoose = require("mongoose");
const FormData = require("form-data");
const User = require("../models/user");
const {
  validateLogin,
  validateLoginFirebase,
} = require("./validation/validation");
const { validateUser } = require("./validation/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const firebase = require("../firebase/firebase");
const {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} = require("firebase/auth");
const uploadFile = require("../utils/fileUploader");
const getFile = require("../utils/getFile");

// Login Firebase
const loginFirebase = async (req, res) => {
  try {
    const { token } = req.body;

    const validate = validateLoginFirebase({ token });

    if (!validate.success) {
      throw {
        status: 400,
        message: validate.messages,
      };
    }

    const auth = getAuth(firebase);
    const credential = GoogleAuthProvider.credential(token);

    const user = await signInWithCredential(auth, credential)
      .then((user) => {
        return user._tokenResponse;
      })
      .catch(() => {
        return undefined;
      });

    const { firstName, lastName, email, photoUrl } = user;

    const userData = await User.findOne({ email });

    if (!userData) {
      const userDoc = await User.create({
        email,
        lastName,
        firstName,
        password: "",
        picture: photoUrl,
      });

      if (!userDoc) {
        throw {
          status: 500,
          message: "Internal server error",
        };
      }

      const payload = {
        email,
        sub: userDoc._id,
      };

      const accessToken = jwt.sign(payload, "catcares", { expiresIn: "24h" });

      return res.status(200).json({
        status: 200,
        data: {
          token: accessToken,
        },
      });
    }

    const payload = {
      email,
      sub: userDoc._id,
    };

    const accessToken = jwt.sign(payload, "catcare", { expiresIn: "24h" });

    return res.status(200).json({
      status: 200,
      data: {
        token: accessToken,
      },
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
};

// Login Normal
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validate = validateLogin({ email, password });

    if (!validate.success) {
      throw {
        status: 400,
        message: validate.messages,
      };
    }

    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      throw {
        status: 400,
        message: validate.messages,
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, userDoc.password);

    if (!isPasswordMatch) {
      throw {
        status: 400,
        message: "Password not match",
      };
    }

    const payload = {
      email: userDoc.email,
      sub: userDoc._id,
    };

    const token = jwt.sign(payload, "catcares", { expiresIn: "24h" });

    return res.status(200).json({
      status: 200,
      data: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      body: { firstName, lastName, email, password, confirmPassword },
    } = req;

    const validate = validateUser({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!validate.success) {
      throw {
        status: 400,
        messages: validate.messages,
      };
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userDoc = await User.create({
      email,
      firstName,
      lastName,
      password: encryptedPassword,
    });

    if (!userDoc) {
      throw {
        status: 500,
        messages: "Internal server error",
      };
    }

    return res.status(201).json({
      status: 201,
      data: {
        _id: userDoc._id,
      },
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
};

// Profil User
const getUserById = (req, res) => {
  const userId = req.params.id;

  // Memeriksa validitas ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      throw {
        status: 404,
        message: "User tidak ditemukan",
      };
    }

    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      noHP: user.noHP,
      alamat: user.alamat,
      foto: user.foto ? await getFile(user.foto) : ""
    }

    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(error.status).json({ error: error.message });
  }
};

// Update Profil User
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, alamat, noHP } = req.body;
    const file = req.file;

    if (file) {
      const uploadedFile = await uploadFile(file);

      const userUpdate = await User.findByIdAndUpdate(req.userId, {
        firstName,
        lastName,
        alamat,
        noHP: noHP,
        foto: uploadedFile.file,
      });

      if (!userUpdate) {
        throw {
          message: "Internal server error",
        };
      }

      return res.status(200).json({
        message: "User telah diupdate",
      });
    } else {
      const userUpdate = await User.findByIdAndUpdate(req.userId, {
        firstName,
        lastName,
        alamat,
        noHP: noHP,
      });

      if (!userUpdate) {
        throw {
          message: "Internal server error",
        };
      }

      return res.status(200).json({
        message: "User telah diupdate",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndRemove(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    res.json({ message: "Pengguna berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  loginFirebase,
  getProfile,
};
