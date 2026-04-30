export const getRegistrationTemplate = (username, formattedDob) => `
<h3>Registration Status</h3>
<p>Welcome, <b>${username}</b>.</p>
<p>Your profile has been successfully integrated. You will receive an automated notification on ${formattedDob} every year.</p>
<hr/>
<small>This is an automated notification. No reply is necessary.</small>
`;

export const getBirthdayTemplate = (username) => `
<h3>Annual Notice</h3>
<p>Happy Birthday, <b>${username}</b>.</p>
<p>Wishing you a seamless and remarkable year ahead. Thank you for being part of our network.</p>
<hr/>
<small>This is an automated notification. No reply is necessary.</small>
`;
