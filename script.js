const url =
  'http://localhost:8081/v3/organizations/61305a9e127c63c6d2c8f76d/incidents/61af4afa45db51dc2b9ec673/sign-upload';
const easyMDE = new EasyMDE({
  spellChecker: true,
  toolbar: false,
  status: true,
  placeholder: 'Incident description (supports markdown)',
  uploadImage: true,
  imageUploadFunction: async function (file, onsuccess, onerror) {
    const fileDetails = {
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    };
    console.log(fileDetails);
    const signedURLResponse = await getSignedURL(url, fileDetails);
    const fileLocationURL = signedURLResponse.data.file_path;
    const signedURL = signedURLResponse.data.signed_url;
    console.log(signedURL);
    const sendFileResponse = await sendFile(signedURL, fileDetails, file);
    console.log(sendFileResponse);
  },
});

async function getSignedURL(url, fileDetails) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzA1YTc4MTI3YzYzYzZkMmM4Zjc0NiIsImZpcnN0TmFtZSI6Illhc2giLCJlbWFpbCI6Inlhc2hAc3F1YWRjYXN0LmNvbSIsIndlYl90b2tlbiI6dHJ1ZSwiYXBpX3Rva2VuIjpmYWxzZSwiaWF0IjoxNjM5MDQ3ODgxLCJleHAiOjE2NTQ4NTkwODEsImlzcyI6ImFwaS5zcXVhZGNhc3QuY29tIiwianRpIjoiNDE5MWNiODI2MmZkNjgwOWEyNzBhN2JhOGFiNjMxYzU4YzA0YThjMjdmZThlM2YyNWVkZjgzZTA3YWRmZmQzZSJ9.sKXIFhRlRmtz70cNlS--j7v3ME3SjY2plSbyQVNJwTc',
    },
    body: JSON.stringify(fileDetails),
  });
  return response.json();
}

async function sendFile(url, fileDetails, file) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      //   'Access-Control-Allow-Origin': '*',
      'Content-Type': fileDetails.file_type + '',
      'Content-Disposition': `attachment;filename=${fileDetails.file_name}`,
      'Content-Length': fileDetails.file_size + '',
    },
    body: file,
  });

  console.log(file);

  return response.json();
}
