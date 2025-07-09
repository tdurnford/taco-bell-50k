// TypeScript declaration file for image imports
// This directs TypeScript to interpret image imports as strings (the 
// path to the file)
// This was created to fix build errors that were observed when 
// importing .png images
declare module '*.png' {
  const value: string;
  export default value;
}
