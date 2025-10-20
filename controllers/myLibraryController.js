const Audiobook  = require("../models/model").Audiobook;
const  Book  = require("../models/model").Book;


const getMyLibrary = async (req, res) => {
  try {
    const userId = req.user.id; 

    const books = await Book.findAll({ where: { userId } });
    const audios = await Audiobook.findAll({ where: { userId } });

    return res.status(200).json({
      message: "User library fetched successfully",
      data: {
        books,
        audios,
      },
    });
  } catch (error) {
    console.error("Error fetching user library:", error);
    return res.status(500).json({
      message: "Failed to load library",
      error: error.message,
    });
  }
};

module.exports = { getMyLibrary };
