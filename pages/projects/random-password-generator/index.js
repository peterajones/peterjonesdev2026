import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PasswordGenerator from '../../../Components/projects/password-generator/PasswordGenerator';
import CodeBlocks from '../../../Components/projects/password-generator/code-blocks';

export default function Index() {
	const [codeDescription, setCodeDescription] = useState(false);
	const [codeBlocks, setCodeBlocks] = useState(false);

	const toggleCodeDescription = () => {
		setCodeDescription(!codeDescription);
	};

	const toggleCodeBlocks = () => {
		setCodeBlocks(!codeBlocks);
	};

	return (
		<>
			<Head>
				<title>Peter Jones | Password Generator</title>
			</Head>
			<div className='content'>
				<Link href='/projects' className='btnLink'>
					Back to Projects
				</Link>
				<div className='btnSpacer'></div>
				<h1>Random Password Generator</h1>
				<p>
					This is a random password generator written in JavaScript.{' '}
					<span className='btn-widget-description'>
						<button onClick={toggleCodeDescription}>
							{codeDescription ? 'Hide description' : 'Read more...'}
						</button>
					</span>
				</p>
				<br />
				<div className='stage'>
					<PasswordGenerator />
				</div>
				<div className='code-content'>
					<div
						className={
							codeDescription
								? 'code-description-open'
								: 'code-description-closed'
						}
					>
						<br />
						<h4>What does this do?</h4>
						<p>
							Set the length of the password that you want to generate and then
							toggle the characters you want in the password (Uppercase letters,
							Lowercase letters, Numbers and Symbols).
						</p>
						<p>
							When you click the &quot;Generate password&quot; button, a random password
							using your settings will be generated. Clicking on the clipboard
							icon button will copy the password to your clipboard.
						</p>
						<p>
							The inspiration for this project came from a{' '}
							<a
								href='https://codepen.io/FlorinPop17/pen/BaBePej'
								target='_new'
							>
								Codepen
							</a>{' '}
							by Florin Pop.
						</p>
						<p>
							There is also a very good walkthrough/explanation on how this
							works by{' '}
							<a
								href='https://www.youtube.com/watch?v=duNmhKgtcsI'
								target='_new'
							>
								Brad Traversy
							</a>{' '}
							on YouTube.
						</p>
						<p>
							Learn more about the clipboard functionality with this{' '}
							<a
								href='https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f'
								target='_new'
							>
								in-depth explanation
							</a>
							.
						</p>
						<br />
						<p>I made some design changes to the original Codepen:</p>
						<ol className='pwg'>
							<li>
								The password length selector was changed from a number input
								field to a range slider.
							</li>
							<li>
								When the character settings are de-selected, the text shows with
								a line-through giving an additional visual aid to show whether
								or not that particular setting is enabled. Clicking on the text
								itself will also toggle the setting.
							</li>
							<li>
								Tab selection was enhanced by changing the HTML markup. The
								order now reflects a more logical progression i.e. Select the
								length, then uppercase, lowercase, numbers, symbols, generate
								password button and then the clipboard button.
							</li>
							<li>
								When the clipboard button has been clicked, a visual
								confirmation message &apos;Copied!&apos; appears below the generated
								password field and slowly fades out.
							</li>
							<li>
								The setttings are stored in localStorage so that they are not
								lost when you refresh the page.
							</li>
						</ol>
						<a
							href='https://github.com/peterajones/weather-forecast-app'
							target='_new'
							className='github-link'
						>
							<span>Get it on GitHub</span>
							<span className='github-getit'>
								<div className='github-logo' />
							</span>
						</a>
						<span className='btn-widget-code'>
							<button onClick={toggleCodeBlocks}>
								{codeBlocks ? 'Hide the code' : 'Show me the code'}
							</button>
						</span>
					</div>
				</div>
				<CodeBlocks
					codeBlocks={codeBlocks}
					toggleCodeBlocks={toggleCodeBlocks}
				/>
			</div>
		</>
	);
}
