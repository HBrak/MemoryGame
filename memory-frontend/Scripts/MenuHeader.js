if (window.self === window.top) {
  // Create header element
  const header = document.createElement('header');

  // Create navbar
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg navbar-light bg-light';

  // Create button for toggling navbar
  const button = document.createElement('button');
  button.className = 'navbar-toggler';
  button.type = 'button';
  button.setAttribute('data-toggle', 'collapse');
  button.setAttribute('data-target', '#navbarNav');
  button.setAttribute('aria-controls', 'navbarNav');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Toggle navigation');
  const span = document.createElement('span');
  span.className = 'navbar-toggler-icon';
  button.appendChild(span);

  // Create div for navbar content
  const div = document.createElement('div');
  div.className = 'collapse navbar-collapse';
  div.id = 'navbarNav';

  // Create ul for navigation items
  const ul = document.createElement('ul');
  ul.className = 'navbar-nav ml-auto';

  // Create navigation items
  const navItems = [
      { href: '../User/PageUserInfo.html', text: 'Account' },
      { href: '../Game/PageGame.html', text: 'Game' }
  ];

  navItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const a = document.createElement('a');
      a.className = 'nav-link btn btn-primary';
      a.href = item.href;
      a.textContent = item.text;
      li.appendChild(a);
      ul.appendChild(li);
  });

  // Assemble the navbar
  div.appendChild(ul);
  nav.appendChild(button);
  nav.appendChild(div);
  header.appendChild(nav);

  // Append the header to the body or a specific container
  document.body.appendChild(header);
}
