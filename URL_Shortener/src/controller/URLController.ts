import { Request, Response } from "express";
import shortId from 'shortid';
import {config} from '../config/Constants'
import {URLModel} from '../database/model/URL'

export class URLController {
  public async shorten(req: Request, res:Response): Promise<void>{
    //ver se a url já não existe
    const {originURL} = req.body
    const url = await URLModel.findOne({originURL})
    if(url){
      res.json(url)
      return
    }
    //criar o hash pra essa url
    const hash = shortId.generate();
    const shortURL = `${config.API_URL}/${hash}`
    //salvar a url no banco
    const newURLParser = await URLModel.create({hash, shortURL, originURL})
    ////////////retornar a url que a gente salvou
    res.json(newURLParser)
  }

  public async redirect(req: Request, res:Response): Promise<void>{
    //Pegar hash da URL
    const {hash} = req.params
    const url = await URLModel.findOne({hash})

    if(url){
      res.redirect(url.originURL)
      return
    }

    res.status(400).json({error: 'URL not found'})
    //Encontrar a URL original pelo hash
    
    //Redirecionar para a URL original a partir do que econtramos no DB
    
  }
}