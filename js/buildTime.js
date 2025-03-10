const BUILD_TIME = '2025.3.10-17:30';

function updateBuildTime() {
    const elements = document.querySelectorAll('.build-time');
    elements.forEach(element => {
        element.textContent = BUILD_TIME;
    });
}

document.addEventListener('DOMContentLoaded', updateBuildTime);