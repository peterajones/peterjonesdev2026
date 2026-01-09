import { useState } from 'react';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  return { props: {} }
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formDataToSend = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSend).toString()
      });

      if (response.ok) {
        router.push('/contact/success');
      } else {
        alert('Form submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Form submission failed. Please try again.');
    }
  };

  return (
    <>
      <div className='container'>

        <main className='main'>
          <h1 className='title'>Contact Form</h1>

          <div className='grid'>
            <div className='form-container'>
              <form name="contact" method="POST" onSubmit={handleSubmit} data-netlify="true" netlify-honeypot="bot-field">
                <input type="hidden" name="form-name" value="contact" />
                <p style={{ display: 'none' }}>
                  <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                </p>
                <p>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </p>
                <p>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className='contact-email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </p>
                <p>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </p>
                <p>
                  <button type="submit" className='btn-submit'>Send</button>
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}