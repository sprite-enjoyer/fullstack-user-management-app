import { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma.js";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  UserCredentials,
  ShouldUserBeSignedOutResponseBodyType,
  ShouldUserBeSignedOutLocalsType,
  ModifyManyUsersRequestBodyType
} from "./user.controller.types.js";

export const register = async (req: Request<any, any, UserCredentials>, res: Response) => {
  if (!req.body.userName || !req.body.password) return res.status(400).json({ message: "necessary arguments not provided", taken: false });
  const user = await prisma.user.findFirst({ where: { userName: req.body.userName } });
  if (user) return res.status(409).json({ message: "username is taken", taken: true });
  res.locals.userName = req.body.userName;
  const salt = await genSalt(10);
  const passwordHash = await hash(req.body.password, salt);
  await prisma.user.create({ data: { userName: req.body.userName, password: passwordHash } });
  return res.status(200).json({ message: "success", taken: false });
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
      sameSite: "strict",
      domain: "https://user-management-website008.netlify.app/",
      path: "/"
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

export const shouldUserBeSignedOut = (
  req: Request,
  res: Response<ShouldUserBeSignedOutResponseBodyType, ShouldUserBeSignedOutLocalsType>
) => {
  const { userNames, jwtUserName } = res.locals;
  for (let userName of userNames) {
    if (userName === jwtUserName) return res.clearCookie("jwt").status(200).json({ message: "success", signOut: true });
  }
  return res.status(200).json({ message: "success", signOut: false });
};

export const checkUser = (req: Request, res: Response) => {
  const [passedJWT, jwtSecret] = [req.headers.cookie?.slice(4) as string, process.env.JWT_SECRET];
  if (!jwtSecret) return res.status(400).json({ message: "jwt data not found", signOut: true });
  if (!passedJWT) return res.status(440).json({ message: "You need to re-login", signOut: true });

  return res.status(200).json({ message: "ok", signOut: false });
}

export const blockUsers = async (
  req: Request<any, any, ModifyManyUsersRequestBodyType>,
  res: Response,
  next: NextFunction
) => {
  const [block, userNames] = [req.body.block, req.body.userNames];
  const [passedJWT, jwtSecret] = [req.headers.cookie?.slice(4) as string, process.env.JWT_SECRET];
  if (!passedJWT || !jwtSecret) return res.status(400).json({ message: "jwt data not found", signOut: false });
  const { userName } = jwt.decode(passedJWT) as { userName: string, blocked: boolean, iat: number };
  [res.locals.jwtUserName, res.locals.userNames] = [userName, [...userNames]];

  for (let userName of req.body.userNames) await prisma.user.update({
    where: { userName: userName },
    data: { blocked: block },
  });
  if (!block) return res.status(200).json({ message: "success", signOut: false });
  else next();
}

export const deleteUsers = async (
  req: Request<any, any, Omit<ModifyManyUsersRequestBodyType, "block">>,
  res: Response,
  next: NextFunction
) => {
  const [passedJWT, jwtSecret] = [req.headers.cookie?.slice(4) as string, process.env.JWT_SECRET];
  if (!passedJWT || !jwtSecret) return res.status(400).json({ message: "jwt data not found", signOut: false });
  const { userName } = jwt.decode(passedJWT) as { userName: string, blocked: boolean, iat: number };

  [res.locals.jwtUserName, res.locals.userNames] = [userName, [...req.body.userNames]];
  for (let userName of req.body.userNames) await prisma.user.delete({ where: { userName: userName } });
  next();
}

export const getAllUsers = async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  if (!result) return res.status(404).json({ message: "users not found", users: null });
  else {
    const users = result.map(user => { return { userName: user.userName, blocked: user.blocked } });
    return res.status(200).json({ message: "success", users: users });
  }
}

export const signOut = (req: Request, res: Response) => {
  res.clearCookie("jwt").status(200).json({ message: "success", success: true });
}