
import { getValidDecodedToken } from '../Modules/JwtHandler.js';

document.addEventListener('DOMContentLoaded', function () {
  // Create header element
  const header = document.createElement('header');
  header.className = 'bg-blue-500'; // Change the background color

  // Create navbar
  const nav = document.createElement('nav');
  // Use flexbox for horizontal layout, adjust padding and background color
  nav.className = 'flex items-center justify-between flex-wrap p-3';

  // Create button for toggling navbar
  const button = document.createElement('button');
  // Adjust button styling, color
  button.className = 'block lg:hidden px-2 py-1 border rounded text-white border-white hover:text-blue-500 hover:border-blue-500';
  button.type = 'button';
  // Additional JavaScript needed for toggle functionality
  button.setAttribute('aria-controls', 'navbarNav');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Toggle navigation');
  const span = document.createElement('span');
  // Add custom icon or class for the navbar toggler icon
  span.className = 'navbar-toggler-icon';
  button.appendChild(span);

  // Create div for navbar content
  const div = document.createElement('div');
  // Adjust layout for horizontal alignment
  div.className = 'w-full block flex-grow lg:flex lg:items-center lg:w-auto';
  div.id = 'navbarNav';

  // Create ul for navigation items
  const ul = document.createElement('ul');
  // Use flexbox for horizontal layout
  ul.className = 'lg:flex lg:flex-row';

  var navItems = [];

  let decodedToken = getValidDecodedToken();

  const isAdmin = decodedToken.roles.includes('ROLE_ADMIN');

  if (isAdmin) {
      // Create navigation items
    navItems = [
      { href: '../User/PageUserInfo.html', text: 'Account' },
      { href: '../Game/PageGame.html', text: 'Game' },
      { href: 'http://localhost:4200/', text: 'AdminPanel' }
    ];
  } else {
    // Create navigation items
    navItems = [
      { href: '../User/PageUserInfo.html', text: 'Account' },
      { href: '../Game/PageGame.html', text: 'Game' }
    ];
  }



  navItems.forEach(item => {
    const li = document.createElement('li');
    // Adjust for horizontal layout
    li.className = 'nav-item lg:mr-6';
    const a = document.createElement('a');
    // Change text color and add hover effect
    a.className = 'block text-white hover:text-blue-300';
    a.href = item.href;
    a.textContent = item.text;

    if (item.text === 'AdminPanel') {
      a.addEventListener('click', (event) => {
        // Prevent the default link behavior
        event.preventDefault();
        
        // Open the link in a new window/tab with _blank target
        window.open(item.href, '_blank');
      });
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  // Assemble the navbar
  div.appendChild(ul);
  nav.appendChild(button);
  nav.appendChild(div);
  header.appendChild(nav);

  // Append the header to the body or a specific container
  document.body.prepend(header);
})
