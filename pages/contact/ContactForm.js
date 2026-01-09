export default function ContactForm() {
  return (
    <>
      <div className='container'>

        <main className='main'>
          <h1 className='title'>Contact Form</h1>

          <div className='grid'>
            <div className='form-container'>
              <form name="contact" method="POST" action="/contact/success" data-netlify="true" netlify-honeypot="bot-field">
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