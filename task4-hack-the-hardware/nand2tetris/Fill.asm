(LOOP)
@KBD
D=M
@BLACK
D;JNE

@color
M=0
@INIT
0;JMP

(BLACK)
@color
M=-1

(INIT)
@SCREEN
D=A
@address
M=D

(FILL)
@color
D=M
@address
A=M
M=D

@address
M=M+1
D=M

@KBD
D=D-A
@FILL
D;JLT

@LOOP
0;JMP
