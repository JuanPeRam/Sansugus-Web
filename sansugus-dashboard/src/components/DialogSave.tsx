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
                <DialogClose asChild>
                    <Button variant={'destructive'}>Cancelar</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button onClick={confirmTrigger}>Confirmar</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
