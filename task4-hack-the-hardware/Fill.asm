
 // Fill.asm
 // Black screen when a key is pressed.
 // White screen when no key is pressed.

 (LOOP)
     @SCREEN
     D=A
     @address
     M=D

     @KBD
     D=M
     @WHITE
     D;JEQ

     // Key pressed: black
     @color
     M=-1
     @DRAW
     0;JMP

 (WHITE)
     @color
     M=0

 (DRAW)
     @address
     A=M
     D=A
     @KBD
     D=D-A
     @LOOP
     D;JEQ

     @color
     D=M
     @address
     A=M
     M=D

     @address
     M=M+1

     @DRAW
     0;JMP
