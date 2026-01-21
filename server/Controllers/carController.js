const Car = require("../Models/carModel");

exports.getAllcars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ success: true, cars });
  } catch (error) {
    console.error("Get all cars error:", error);
    return res.status(500).json({ error: "Server error fetching cars" });
  }
};

exports.addCar = async (req, res) => {
  try {
    const newcar = new Car(req.body);
    await newcar.save();
    res.status(201).json({ success: true, message: "Car added successfully", car: newcar });
  } catch (error) {
    console.error("Add car error:", error);
    return res.status(500).json({ error: "Server error adding car" });
  }
};

exports.editCar = async (req, res) => {
  try {
    const car = await Car.findById(req.body._id);
    
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    car.name = req.body.name;
    car.image = req.body.image;
    car.fuelType = req.body.fuelType;
    car.rentPerHour = req.body.rentPerHour;
    car.capacity = req.body.capacity;

    await car.save();

    res.json({ success: true, message: "Car details updated successfully", car });
  } catch (error) {
    console.error("Edit car error:", error);
    return res.status(500).json({ error: "Server error updating car" });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.body.carid);
    
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("Delete car error:", error);
    return res.status(500).json({ error: "Server error deleting car" });
  }
};
