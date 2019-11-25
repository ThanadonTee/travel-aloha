const contactModel = require("../../models/contact");
const multer = require("../../utils/multer-config")
exports.getIndex = (req, res) => {
  res.render("contact/index", {
    pageTitle: "TravelAloha - Contact",
    user: req.user
  });
};
exports.getHotelInfo = (req, res) => {
  try{
    res.render("contact/add-new-hotel", {
      pageTitle: "TravelAloha - Contact - Register New Hotel",
      user: req.user
    });
  }catch (err) {
    res.sendStatus(404);
  }
};
exports.getAirlineInfo = (req, res) => {
  res.render("contact/add-new-airline", {
    pageTitle: "TravelAloha - Contact - Register New Airline",
    user: req.user
  });
};
exports.postHotelInfo = async (req, res) => {
  const {
    hotelName,
    hotelEmail,
    hotelAddress,
    hotelTelNumber,
    hotelContactNumber,
    hotelDescription,
    hotelProfile,
    hotelPicture
  } = req.body;
  try {
    await contactModel.insertNewHotel({
      hotelName,
      hotelDescription,
      hotelAddress,
      hotelTelNumber,
      hotelContactNumber,
      hotelEmail
    });
    // ** Wait for learning upload file
    // await contactModel.insertNewHotelFile({
    //   hotelPicture
    // })
    res.redirect("dashboard");
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(404);
    throw new Error(`[ERR] insertNewHotel: ${error}`);
  }
};
exports.getDashboard = async(req, res) => {
  try{
    let hotelData = await contactModel.getHotelDashboard();
    let airlineData = await contactModel.getAirlineDashboard();
    res.render("contact/dashboard", {
      pageTitle: "TravelAloha - Contact - Dashboard",
      user: req.user,
      hotel: hotelData,
      airline: airlineData
    });
    res.sendStatus(204);
  }catch (err) {
    res.sendStatus(404);
  }
};
exports.postAirlineInfo = async (req, res) => {
  const {
    airlineName,
    airlineEmail,
    airlineAddress,
    airlineNationality,
    airlineTelNumber,
    airlineContactNumber,
    airlineDescription
  } = req.body;

  try {
    await contactModel.insertNewAirline({
      airlineName,
      airlineNationality,
      airlineEmail,
      airlineDescription,
      airlineAddress,
      airlineTelNumber,
      airlineContactNumber
    });
    res.redirect("dashboard");
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(404);
    throw new Error(`[ERR] insertNewHotel: ${error}`);
  }
};
exports.getHotelDetail = (req, res) => {
  let data = contactModel.getHotelInfo();
  try{
    res.render("contact/new-hotel-detail", {
      pageTitle: "TravelAloha - Contact - New Hotel Detail",
      user: req.user,
      hotel: data
    });
    res.sendStatus(204);
  }catch(error){
    res.sendStatus(404);
    throw new Error(`[ERR] getHotelInfo: ${error}`);
  }
};
exports.getAirlineDetail = (req, res) => {
  let data = contactModel.getAirlineInfo();
  try{
    res.render("contact/new-airline-detail", {
      pageTitle: "TravelAloha - Contact - New Airline Detail",
      user: req.user,
      airline: data
    });
    res.sendStatus(204);
  }catch(error){
    res.sendStatus(404);
    throw new Error(`[ERR] getAirlineInfo: ${error}`);
  }
};
