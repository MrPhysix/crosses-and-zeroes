declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.ico' {
  const value: string;
  export default value;
}
