'use client';
import { useRouter } from 'next/router';

export default function ContactForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      router.push('/contact/success');
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
              <form name="contact" onSubmit={handleSubmit}>
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
                    required
                  />
                </p>
                <p>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
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