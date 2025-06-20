{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.addEventListener('DOMContentLoaded', () => \{\
    // Smooth scrolling for navigation links\
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => \{\
        anchor.addEventListener('click', function (e) \{\
            e.preventDefault();\
\
            document.querySelector(this.getAttribute('href')).scrollIntoView(\{\
                behavior: 'smooth'\
            \});\
        \});\
    \});\
\
    // Simple FAQ Accordion\
    document.querySelectorAll('.faq-item h3').forEach(item => \{\
        item.addEventListener('click', () => \{\
            const answer = item.nextElementSibling;\
            if (answer.style.display === 'block') \{\
                answer.style.display = 'none';\
            \} else \{\
                answer.style.display = 'block';\
            \}\
        \});\
    \});\
\
    // Campaign Progress Bar (Dummy Data for Demo)\
    const goalAmount = 50000; // Your campaign goal\
    let raisedAmount = 15000; // Manually update this for the demo, or fetch from an API\
    const progressBar = document.getElementById('progressBar');\
    const raisedAmountElement = document.getElementById('raisedAmount');\
    const goalAmountElement = document.getElementById('goalAmount');\
\
    goalAmountElement.textContent = goalAmount.toLocaleString(); // Format with commas\
    raisedAmountElement.textContent = raisedAmount.toLocaleString(); // Format with commas\
\
    const progressPercentage = (raisedAmount / goalAmount) * 100;\
    progressBar.style.width = `$\{Math.min(progressPercentage, 100)\}%`; // Ensure it doesn't exceed 100%\
\
    // You would replace the 'raisedAmount' variable with actual data from your crowdfunding platform's API\
    // if you were building a real dynamic site. For this static example, you update it manually.\
\});}