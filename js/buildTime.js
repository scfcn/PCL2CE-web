const BUILD_TIME = '2025.8.5 17:02:14';

function updateBuildTime() {
    const elements = document.querySelectorAll('.build-time');
    elements.forEach(element => {
        element.textContent = BUILD_TIME;
    });
}

document.addEventListener('DOMContentLoaded', updateBuildTime);
document.addEventListener('pjax:reinitialize', updateBuildTime);