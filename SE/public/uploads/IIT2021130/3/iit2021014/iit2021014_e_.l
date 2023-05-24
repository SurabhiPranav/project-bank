%{

%}

 



start \/\*



end  \*\/

 



%%

 



\/\/(.*) ;



{start}.*{end} ;

 

%%



int yywrap(){

return 1;

}



int main(void)

{

yyin=fopen("inputfile.c","r");

yyout=fopen("out.c","w");



yylex();

return 0;

}
