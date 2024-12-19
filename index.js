function openNav() {
    document.getElementById("side-nav").style.width = "250px";
}

function closeNav() {
    document.getElementById("side-nav").style.width = "0";
}

// Close the sidebar if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#hamburger') && !event.target.closest('.side-nav')) {
        closeNav();
    }
}

// View profile
function toggleEditProfile() {
    const editProfile = document.getElementById("editProfile");
    if (editProfile.style.display === "none" || !editProfile.style.display) {
        editProfile.style.display = "block";
    } else {
        editProfile.style.display = "none";
    }
}

//Send notification
document.getElementById('blood-request-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const recipientName = document.getElementById('recipientName').value;
    const bloodType = document.getElementById('blood-type').value;
    const location = document.getElementById('location').value;
    const urgency = document.getElementById('urgency').value;

    fetch('http://localhost:3000/request-blood', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipientName, bloodType, location, urgency })
    })
    .then(response => response.text())
    .then(data => {
        const notification = document.getElementById('notification');
        notification.style.display = 'block';
        notification.innerText = data;
        notification.style.color = 'green';
    })
    .catch(error => {
        const notification = document.getElementById('notification');
        notification.style.display = 'block';
        notification.innerText = 'Error sending SMS notifications';
        notification.style.color = 'red';
        console.error('Error:', error);
    });
});