const requestedBloodGroup = "B+"; // Example requested blood group

const donors = [
    {
        name: "Satyam Sharma",
        bloodType: "A+",
        location: [28.7041, 77.1025], // New Delhi
        contact: "1234567890",
        email: "john@example.com",
        profileImage: "path/to/profile1.jpg",
        address: "123 Main St, New Delhi"
    },
    {
        name: "Priyesh Yadav",
        bloodType: "B+",
        location: [28.5355, 77.3910], // Noida
        contact: "0987654321",
        email: "jane@example.com",
        profileImage: "path/to/profile2.jpg",
        address: "456 Elm St, Noida"
    },
    {
        name: "Neeta Mishra",
        bloodType: "B+",
        location: [28.4595, 77.0266], // Gurgaon
        contact: "456-789-1234",
        email: "robert@example.com",
        profileImage: "path/to/profile3.jpg",
        address: "789 Oak St, Gurgaon"
    },
    {
        name: "Ayaan Zubair",
        bloodType: "O-",
        location: [28.7041, 77.1025], // New Delhi
        contact: "9876543210",
        email: "ayaan@example.com",
        profileImage: "path/to/profile4.jpg",
        address: "321 Pine St, New Delhi"
    },
    {
        name: "Harshita Salvi",
        bloodType: "B+",
        location: [28.7041, 77.1025], //
        contact: "7000742076",
        email: "hary@example.com",
        profileImage: "path/to/profile4.jpg",
        address: " Delhi, NCR"
    },
];

// Initialize the map
const map = L.map('map').setView([28.6139, 77.2090], 10); // Default to New Delhi

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Display donors on the map and in the donor list
const donorList = document.getElementById('donor-list');

// Function to check if a donor can donate to the requested blood group
function canDonate(donorBloodType, requestedBloodType) {
    const compatibleBloodTypes = {
        "A+": ["A+", "AB+"],
        "A-": ["A+", "A-", "AB+", "AB-"],
        "B+": ["B+", "AB+"],
        "B-": ["B+", "B-", "AB+", "AB-"],
        "AB+": ["AB+"],
        "AB-": ["AB+", "AB-"],
        "O+": ["O+", "A+", "B+", "AB+"],
        "O-": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
    };
    return compatibleBloodTypes[donorBloodType].includes(requestedBloodType);
}

donors.forEach((donor, index) => {
    console.log(`Processing donor: ${donor.name}, Blood Type: ${donor.bloodType}`);
    if (canDonate(donor.bloodType, requestedBloodGroup)) {
        console.log(`Donor ${donor.name} can donate to ${requestedBloodGroup}`);

        // Add marker to the map
        const marker = L.marker(donor.location).addTo(map)
            .bindPopup(`<strong>${donor.name}</strong><br>Blood Type: ${donor.bloodType}<br>`);

        // Create a donor card
        const donorCard = document.createElement('div');
        donorCard.className = 'donor-card';
        donorCard.innerHTML = `
            <div class="donor-info">
                <img src="${donor.profileImage}" alt="${donor.name}" class="profile-image">
                <div>
                    <p><strong>Name:</strong> ${donor.name}</p>
                    <p><strong>Blood Type:</strong> ${donor.bloodType}</p>
                    <p><strong>Contact:</strong> ${donor.contact}</p>
                    <p><strong>Address:</strong> ${donor.address}</p>
                </div>
            </div>
            <div class="donor-actions">
                <button id="call" onclick="window.location.href='tel:${donor.contact}'"><i class="fa-solid fa-phone"></i> Call</button>
                <button id="message" onclick="window.location.href='sms:${donor.contact}'"><i class="fa-solid fa-comment"></i> Message</button>
                <button class="confirm-donation-btn" data-donor-id="${index}">Confirm Donation</button>
            </div>
        `;
        donorList.appendChild(donorCard);
    } else {
        console.log(`Donor ${donor.name} is not compatible with ${requestedBloodGroup}`);
    }
});

// Add functionality for Confirm Donation buttons
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("confirm-donation-btn")) {
        const donorId = e.target.getAttribute("data-donor-id");

        // Simulate backend API request to confirm donation
        const response = await fetch(`http://localhost:5000/api/donations/confirm/${donorId}`, {
            method: "PATCH",
        });

        if (response.ok) {
            alert("Donation successfully confirmed!");
            e.target.textContent = "Donation Confirmed";
            e.target.disabled = true; // Disable button after confirmation
        } 
        
        else {
            alert("Failed to confirm donation. Please try again.");
        }
    }
});


// donors.forEach((donor, index) => {
//     console.log(`Processing donor: ${donor.name}, Blood Type: ${donor.bloodType}`);
//     if (canDonate(donor.bloodType, requestedBloodGroup)) {
//         console.log(`Donor ${donor.name} can donate to ${requestedBloodGroup}`);
//         // Add marker to the map
//         const marker = L.marker(donor.location).addTo(map)
//             .bindPopup(`<strong>${donor.name}</strong><br>Blood Type: ${donor.bloodType}<br>`);

//         // Create a donor card
//         const donorCard = document.createElement('div');
//         donorCard.className = 'donor-card';
//         donorCard.innerHTML = `
//             <div class="donor-info">
//                 <img src="${donor.profileImage}" alt="${donor.name}" class="profile-image">
//                 <div>
//                     <p><strong>Name:</strong> ${donor.name}</p>
//                     <p><strong>Blood Type:</strong> ${donor.bloodType}</p>
//                     <p><strong>Contact:</strong> ${donor.contact}</p>
//                     <p><strong>Address:</strong> ${donor.address}</p>
//                 </div>
//             </div>
//             <div class="donor-actions">
//                 <button id="call" onclick="window.location.href='tel:${donor.contact}'"><i class="fa-solid fa-phone"></i>Call</button>
//                 <button id="message" onclick="window.location.href='sms:${donor.contact}'"><i class="fa-solid fa-comment"></i>Message</button>
//             </div>
//         `;
//         donorList.appendChild(donorCard);
//     } else {
//         console.log(`Donor ${donor.name} is not compatible with ${requestedBloodGroup}`);
//     }
// });


// Simulate real-time map update every 1 minute (optional)
setInterval(() => {
    donors.forEach((donor, index) => {
        // Example: Randomize donor location within a small radius for demonstration
        donor.location[0] += (Math.random() - 0.5) * 0.01;
        donor.location[1] += (Math.random() - 0.5) * 0.01;

        // Update map marker
        const newMarker = L.marker(donor.location).addTo(map);
    });
}, 60000);