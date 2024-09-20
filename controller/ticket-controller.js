const Seat = require('../modals/ticket-modals');

// Function to initialize seats
exports.initializeSeats = async (req, res) => {
    try {
        const seats = new Seat({
            A: "0000000", B: "0000000", C: "0000000", D: "0000000", E: "0000000", 
            F: "0000000", G: "0000000", H: "0000000", I: "0000000", J: "0000000", 
            K: "0000000", L: "0000000", M: "000"
        });
        await seats.save();
        res.status(201).send('Seats initialized');
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateSeats = async (req, res) => {
    try {
        // Log the request to ensure the body is received
        console.log('Request Body:', req.body);

        const seatData = req.body;

        // Check if the body is missing or empty
        if (!seatData || Object.keys(seatData).length === 0) {
            return res.status(400).json({ message: "Invalid data. Please provide seat updates." });
        }

        const seatDocument = await Seat.findOne();
        if (!seatDocument) {
            return res.status(404).send("Seats not initialized");
        }

        // Update seat data
        const updatedData = await Seat.updateOne({ _id: seatDocument._id }, { $set: seatData });

        res.status(200).json({
            message: "Seats updated successfully",
            updatedData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Function to display current seat status
exports.showSeats = async (req, res) => {
    try {
        const seats = await Seat.findOne();
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Function to book seats
exports.bookSeats = async (req, res) => {
    try {
        const numSeats = req.body.numSeats;
        console.log('Number of seats requested:', numSeats);

        if (numSeats < 1 || numSeats > 7) {
            return res.status(400).json({ message: 'Seat request must be between 1 and 7.' });
        }

        // Fetch the current seat arrangement
        const seats = await Seat.findOne(); 
        if (!seats) {
            return res.status(404).send("Seats not initialized");
        }

        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
        let seatsAssigned = [];
        let seatDetails = []; // To store seat remaining count and row

        // Calculate remaining seats in each row and check if adjacent seats can fulfill the request
        for (let row of rows) {
            let seatRow = seats[row];
            let availableSeats = seatRow.split('').map((seat, index) => ({ seat, index }));
            availableSeats = availableSeats.filter(seat => seat.seat === '0');

            if (availableSeats.length >= numSeats) {
                // Try to allocate adjacent seats if possible in a single row
                let adjacentSeats = 0;
                let startIdx = -1;

                for (let i = 0; i < availableSeats.length - numSeats + 1; i++) {
                    let contiguous = true;
                    for (let j = 1; j < numSeats; j++) {
                        if (availableSeats[i + j].index !== availableSeats[i].index + j) {
                            contiguous = false;
                            break;
                        }
                    }
                    if (contiguous) {
                        startIdx = i;
                        adjacentSeats = numSeats;
                        break;
                    }
                }

                if (adjacentSeats === numSeats) {
                    // Allocate the seats in this row
                    for (let i = 0; i < numSeats; i++) {
                        seatRow = seatRow.substr(0, availableSeats[startIdx + i].index) + '1' + seatRow.substr(availableSeats[startIdx + i].index + 1);
                        seatsAssigned.push(row + (availableSeats[startIdx + i].index + 1));
                    }
                    seats[row] = seatRow;
                    await Seat.updateOne({ _id: seats._id }, { $set: seats });

                    return res.status(200).json({
                        message: "Seats booked successfully",
                        seatsAssigned
                    });
                }
            }

            seatDetails.push({ row, available: availableSeats.length });
        }

        // Case 2: Allocate optimally across rows
        seatDetails = seatDetails.filter(detail => detail.available > 0).sort((a, b) => b.available - a.available);
        const totalRemainingSeats = seatDetails.reduce((acc, row) => acc + row.available, 0);

        if (totalRemainingSeats < numSeats) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Allocate seats across rows
        for (let detail of seatDetails) {
            if (seatsAssigned.length === numSeats) break;
            let seatRow = seats[detail.row];
            let availableSeats = seatRow.split('').map((seat, index) => ({ seat, index })).filter(seat => seat.seat === '0');

            while (availableSeats.length > 0 && seatsAssigned.length < numSeats) {
                let nextSeat = availableSeats.shift();
                seatRow = seatRow.substr(0, nextSeat.index) + '1' + seatRow.substr(nextSeat.index + 1);
                seatsAssigned.push(detail.row + (nextSeat.index + 1));
            }

            seats[detail.row] = seatRow;
        }

        // Save the updated seating arrangement
        await Seat.updateOne({ _id: seats._id }, { $set: seats });

        return res.status(200).json({
            message: "Seats booked successfully",
            seatsAssigned
        });

    } catch (error) {
        console.error('Error booking seats:', error);
        res.status(500).json({ message: error.message });
    }
};


//for reset the database
exports.resetSeats = async (req, res) => {
    try {
        // Define the initial state for all rows
        const initialSeats = {
            A: "0000000",
            B: "0000000",
            C: "0000000",
            D: "0000000",
            E: "0000000",
            F: "0000000",
            G: "0000000",
            H: "0000000",
            I: "0000000",
            J: "0000000",
            K: "0000000",
            L: "0000000",
            M: "000"
        };

        // Find the seat document
        const seatDocument = await Seat.findOne();
        if (!seatDocument) {
            return res.status(404).send("Seats not initialized");
        }

        // Reset all seats to the initial state
        await Seat.updateOne({ _id: seatDocument._id }, { $set: initialSeats });

        return res.status(200).json({
            message: "Seats reset successfully"
        });

    } catch (error) {
        console.error('Error resetting seats:', error);
        res.status(500).json({ message: error.message });
    }
};
