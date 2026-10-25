// utils/gtag.js
export const loadGoogleTag = () => {
    if (window.gtag) return; // prevent multiple inserts
  
    const script1 = document.createElement('script');
    script1.setAttribute('async', '');
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=AW-11515103107';
    document.head.appendChild(script1);
  
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-11515103107');
    `;
    document.head.appendChild(script2);
  };
  