export async function run(command: string, ...args: string[]) {
  const instance = new Deno.Command(command, {
    args: args,
  });

  const { code, stdout, stderr } = await instance.output();

  if (code) {
    const error = stderr.toString();
    throw new Error(`(${code}) ${error}`);
  } else  {
    return stdout.toString()
  }
}
