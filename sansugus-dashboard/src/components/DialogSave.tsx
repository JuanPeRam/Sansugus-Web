import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

type DialogSaveProps = {
    confirmTrigger: ()=>void,
    buttonText: string
}
export const DialogSave: React.FC<DialogSaveProps> = ({confirmTrigger,buttonText}) => {

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant={'outline'}>{buttonText}</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                ¿Estás segur@?
            </DialogHeader>
            <DialogDescription>
                Se guardarán todos los cambios
            </DialogDescription>
            <DialogFooter className='flex justify-between'>
                <DialogClose>
                    <Button variant={'destructive'}>Cancelar</Button>
                </DialogClose>
                <DialogClose>
                    <Button onClick={confirmTrigger} type='submit'>Confirmar</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
