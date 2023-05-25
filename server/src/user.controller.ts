import { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma.js";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

export type UserCredentials = { userName: string, password: string };

export const register = async (req: Request<any, any, UserCredentials>, res: Response, next: NextFunction) => {
  if (!req.body.userName || !req.body.password) return res.status(400).json({ message: "necessary arguments not provided" });
  const user = await prisma.user.findFirst({ where: { userName: req.body.userName } });
  if (user) return res.status(409).json({ message: "username is taken" });
  res.locals.userName = req.body.userName;
  const salt = await genSalt(10);
  const passwordHash = await hash(req.body.password, salt);

  await prisma.user.create({ data: { userName: req.body.userName, password: passwordHash } });
  next();
};

export const sendJWT = async (req: Request, res: Response) => {
  const { userName } = res.locals;
  const secret = process.env.JWT_SECRET;
  const user = await prisma.user.findFirst({ where: { userName: userName } });
  if (!userName || !secret || !user) return res.status(400).json({ message: "token couldn't be created" });

  const token = jwt.sign({ userName: userName, blocked: user.blocked }, secret);
  const date = new Date();
  date.setTime(date.getTime() + (24 * 60 * 60 * 1000));

  return res.cookie('jwt', token,
    {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      expires: date,
    }
  ).status(200).json({ message: "request completed successfully" });
}

export const login = async (req: Request<any, any, UserCredentials>, res: Response, next: NextFunction) => {
  if (!req.body.userName || !req.body.password) return res.status(400).json({ message: "user credentials not provided" });
  res.locals.userName = req.body.userName;
  const user = await prisma.user.findUnique({ where: { userName: req.body.userName } });
  if (!user) return res.status(401).json({ message: "invalid user credentials" });
  if (user.blocked) return res.status(409).json({ message: "user is blocked!" });

  const passwordsAreEqual = await compare(req.body.password, user.password);
  if (passwordsAreEqual) next();
  else return res.status(401).json({ message: "invalid user credentials" });
};

export type DeleteUserRequestBodyType = { userName: string };
export const deleteUser = async (req: Request<any, any, DeleteUserRequestBodyType>, res: Response) => {
  if (!req.body.userName) return res.status(400).json({ message: "provide user credentials" });
  const [passedJWT, jwtSecret] = [req.headers.jwt as string, process.env.JWT_SECRET];
  if (!passedJWT || !jwtSecret) return res.status(401).json({ message: "jwt data not found" });
  const user = await prisma.user.delete({ where: { userName: req.body.userName } });
  const jwtData = jwt.decode(passedJWT) as { userName: string, blocked: boolean, iat: number };
  if (jwtData.userName === user.userName) res.clearCookie("jwt").status(200).json({ message: "success", signOut: true });
  return res.status(200).json({ message: "success", signOut: false });
};

export type BlockUserRequestBodyType = { userName: string, blocked: boolean };
export const blockUser = async (req: Request<any, any, BlockUserRequestBodyType>, res: Response) => {
  const [passedJWT, jwtSecret] = [req.headers.jwt as string, process.env.JWT_SECRET];
  if (!passedJWT || !jwtSecret) return res.status(400).json({ message: "jwt data not found" });
  if (req.body.blocked === undefined || !req.body.userName) return res.status(400).json({ message: "bad request" });

  const user = await prisma.user.update({
    where: { userName: req.body.userName },
    data: { blocked: Boolean(req.body.blocked) },
  });

  const jwtData = jwt.decode(passedJWT) as { userName: string, blocked: boolean, iat: number };
  if (jwtData.userName === user.userName) return res.clearCookie("jwt").status(200).json({ message: "success", signOut: true });
  if (!user) return res.status(404).json({ message: "user not found!", signOut: false });
  return res.status(200).json({ message: "success", signOut: false })
}