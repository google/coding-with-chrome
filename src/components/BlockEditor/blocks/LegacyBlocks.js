/**
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Legacy Blocks.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @type {object}
 */
const generalSampleImageBlocks = {
  general_sample_image_ball_red:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAASFBMVEUAAAD/QEDu7u7RDw/5OTniISHXFhbyMTHnJyf9WlrrKyvNDAzJCQn7amr+Tk7+Rkbyx8fcHBz8Y2P8YGDw3t7xzs73kpL5fHxpXOCFAAAAAXRSTlMAQObYZgAAAQ9JREFUSMe9lksOgzAMROM4ISQF+m/vf9MiI+qqJcGz6dsAEqPxxAjbbcKOZ+aLDe5iCiSEFNkg6OV1JeyoONEG5VAVHHqqECuijuqEreqGSE3Ov5JEO/TfHqKAND0ZOFuT05SveZI7VgVTneN4996frnJuetaloXj4haf0x2Iy+pXLZ2mpkePmV05HIir7JtkrWW1Ksy5lfKdhQlyC9sSWZabTxltObK0skGDoi5A0iqX7axjaY8qXPOmjpMdgXNIBkr8Wxo4JI0grIZJ8MBDRofnls2Q0ykwB60JtWH+uRopbYMxEKEASzEZ/sPbeMD4sgCEGjjFVDPB4xYc4virgC0mDAV178OVKYaGyw70A7RINOp90pO0AAAAASUVORK5CYII=</field><field name="url">/assets/phaser/samples/ball_red.png</field></block>',
  general_sample_image_ball_green:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAS1BMVEUAAAA//z/t7e0R0hEOzg4h4iE9/j0n6ScJygkx8TEX1xc6+jo3+DdZ/Vlp+2lg/GBN/k1F/kUs7SzG8sYc2xzd8N3N8c2R95F7+Xuxsr1UAAAAAXRSTlMAQObYZgAAASJJREFUSMe1lttuAyEMRDE27LK3ZJP08v9fWkrloiQsMIpyXngambEt26aIGI7Epw9hF2ZKLMFxh2CY6Y7FSV0QqMAwHgrGgcp4dyCaPB0ycymEoxr+9iy5UIPhMUYgAjWOOrjdOacK5/W0npMfzgqp5GrfPq2111PKm/RY37/sH98UcapgOmazym8cr2FCxceHVa67Zq0eZLWZlSLSLOJmM9u/G/FIlEVr0uslMkXJQNSbMf3ZTEqrLomg+eqrvpohpdFjiroH4DdKXvwYE4jAkiWVEiKkhoFwBvY/afMjViIX9F8Gy5lUhmtlyEJhvOTRBzkxQNLygO2tjecXloUOWXiNtRffCK9XfInjpwJ+kFQY4bNHj6sFOK5UJswsYoqCH8u8DoFBM54BAAAAAElFTkSuQmCC</field><field name="url">/assets/phaser/samples/ball_green.png</field></block>',
  general_sample_image_ball_blue:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAQlBMVEUAAAA+Pv/t7e0ODs0REdAuLvAgIOIWFtUmJuk3N/hXV/0JCcdMTP5ERP5fX/xoaPvFxfIcHNp6evmQkPfMzPHc3PCc1gouAAAAAXRSTlMAQObYZgAAAQlJREFUSMe9lsmSwyAMRBESm5c4meX/f3WAKUPFcYg6h7wLp66mJQrJnMJGMvnQwcG7RJXkvCgEke5JnscCRydEVjt0njkFGnCWafY05PYocfSCePTIClDjScFNnXyZLtNyrAEPBOv2Y629XqjAmujrt/3nq/ZnV8jAZLM71Ydfmyy/TXJdW9WGJpPtTN3GDe/V2VoaJsQltZ7oshRClkQibcX2m5VT15eKa/XSdL+SmovqjVVKehDBJQGQfPRibIQwapExXH0wEN7A+UOWMBil4NB7GaxmfPhc9Z+sYCZYGm92GDXR90beHRZAHHyMxRker/gQx1cFfCEZMKNrD75cdZhFhNmcCv4AvgwM2Pf0rEYAAAAASUVORK5CYII=</field><field name="url">/assets/phaser/samples/ball_blue.png</field></block>',
  general_sample_image_50px_red:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEX/XV2ZAABKhU15AAAAPUlEQVQY02P4DwYHGBoYQMBhlMZBt59nPtEApFsEmjSgtCoDEt08ofkQWH1AEysazdEA0t/PBKRxmg+LBwDPjDxK1kqocgAAAABJRU5ErkJggg==</field><field name="url">/assets/phaser/samples/50px_red.png</field></block>',
  general_sample_image_50px_green:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEXQ/FxgnAAuZaaQAAAAPUlEQVQY02P4DwYHGBoYQMBhlMZBt59nPtEApFsEmjSgtCoDEt08ofkQWH1AEysazdEA0t/PBKRxmg+LBwDPjDxK1kqocgAAAABJRU5ErkJggg==</field><field name="url">/assets/phaser/samples/50px_green.png</field></block>',
  general_sample_image_50px_blue:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEVcvPwAXJwoG/B+AAAAPUlEQVQY02P4DwYHGBoYQMBhlMZBt59nPtEApFsEmjSgtCoDEt08ofkQWH1AEysazdEA0t/PBKRxmg+LBwDPjDxK1kqocgAAAABJRU5ErkJggg==</field><field name="url">/assets/phaser/samples/50px_blue.png</field></block>',
  general_sample_image_bg_01:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAMgBAMAAABCNlUOAAAAG1BMVEVcvPw1k9MnhcVPru5CoeEAXJwad7cNaqr29vaayGE2AAAP10lEQVR42uybbY7iMBBEfckWfZEILoDkYy/Z0WYHAfJn7DJVz7L8Y2aIh5dKO8EEE3RIOiGSToikEyLphEg6IZJOiKQTIumESDohkk6IpBMi6YRIOiGSToikEyLphEg6IZJOiKQTIumESDoh5dLjwd1e8OOHJmApkx4PXsUfxuUdnQLph9P3buMb7iYAyZbu8TO/f6y045MrPSaR9WXIk+4xyvr3kCXdY5T1LyJDemzkbp1wnUj1lEmPu/XpUXe0K4hDzKKKtHQ3nx91ByscjjGNOrKS3o614WjrhdUfR6Sl+2zp8R8oj38wZlHNCkmPEcw6xixaSNf0ydJjBLOOMYsG8KXHCGb9G543D5DeYsXhnv5IOkLQB0cdYhKNpKXDB31kykikG3zQR77hLNIdeek++g0nqelmuPfokl5DlnQHfRgHtZJb6eqeI93mfdQSI6B2sOlUkJaeG/X+u2ELVu9u43j6j4/heTrYZ0K3nTO2033fO1bS/elwvo8fJon3afB/+u2Rs3PwlOxh2v3Dibbi9rFgecwKWk5ROXsOL8YRthLV02vf+4kkDltTUNrnMH8vUQN9vuFyJinrfv4buR8C2rqX2mj/Lls5ldZRK8xU61UvHqyUgcLTUavZkwoQ9E4z9qqXX+X76b3uf3CS3muLcIX2VaT32fcOFfVm6Q1HCJuZLdI9How9djyB+/lzur//23WS3gWksI+Ykb1F0rNxrKt7w0EkvQiHcd4ofTO17Oa9nDfPJFP6279V0otwiHreoaYDLMuX6bfYgT5zyQy6vembkl6CI4S8x336Nr1SrtOapN/7ziV12dl/RzW9B9M/Uev07H16fFZqg5fq6VZ8RNX0Yhxxn4yXHU336aUNLOhVTUkvBaei16KafvoC3qbPWDW9Hccq6DWETRRyi/lskCjp5fjaOf9b038eyWnMHz3XOch8n0YlvRZfN+amml5N+vYcFyW9Gl8y5WZKehu3hZbsvwgX+0Fj7fh0UQeYT2JU0jlRTSdESSckXOxipk7VlXRCVNMJUdIJCRdTY2tKOiHBDGA5qT60K+mEqKbzNSWdkWDTTzy1sU01nZJwEXQo6YSophM2JZ0Q1XRClHRCHkm3y45GllFJp0Q1nZBwfZjf+6aRZlTSCVFNJ0RJJyRc9yu9OlVX0gkJ05eSGgePqumUhOumxtaUdELC9KWk+vCupBOimk7YlHRCwvTTTm1wU02nJFyvD/UPNNKMSjojqul07Q87d5jbSAhDAdi3ZG/gnKCPG+Bjr6Jqtxsl7YYBzDPwIf5GZYzz3KnU0+lbEhzbOZ2+odPpGxKkYzen0zd0Mn1Dp9NbZfsP0JGUkM6u3XZNAcHPjtPpdbK9hbz5N890+0FJD6y3kubYNNOtUrFRCmYQpI3WL+NT/J+DYBySe/0pG68CX5KQ+o+HZCMsY4PPfCaC3jLZ+Mrc4lOavSHTW1MTyWPFqPhdqToXVaZz3e04Jff98pOuVyhbhcrPXmJU52h1QU9MMWbBwI8ASN12tgpIwLhtwRQgwWdj1Uy3YAocSee8yByJHizP334tR5fpTAFmoRT4EvSQ2Y5okcCboFkmPKVFA0/SOgxe/0JL43a4TL9zGt7bM502xyyiAh+CBpn4G81CKvAgisu4T2gxwYHgMvZ7HerPLa5VF1yV+Q8Ys+wYTnBViAiLWPaC0UShQP3uVHQFMHQHrHsZ/UxW7/S7aHV36HQorgiR6V8iFR6DLT29P4lReYwnisurQ6JPWcbM4fzrvpF7jb3ZCzwImkZBa1MePm/7Ub44PQdBoxBX+xP5q1m4kfaEuFkTqNdirjnUcQl6yCFuuJGCN+l3gdiHeMI8L9AZS9Ab7U0nKjrmElVF91173VUd9s0mgqqybBWMkCmvvdWJ9/v3u2RMamSuV1BaP3WskN2Vmd6OsgXsTUv3OSA6zFuDu6tJua5sBCNliix/kO0NC03qr4jDwPjUXpMHWPNTdP6w/ry3/OeBgH1j6Sj/S3RbdhnjtFJh107/I9vd+in+r607/ctt2Tn9le07/dF66f3Kx+n078RO7Z+cTt/S6fQNyQfO2m2dTv/NvvnmNAzDUNyndXICkxMUHxuqqWiMtg6r82fz+z1Z/gA0It3rcyMtIMj0eAicHhBkekDB6QGh4R87qLOQ6SEhEflAxSo4PSDI9ICC0wNC4xMG1bng9IjQdvs/0MN0OD0gJCAccHpASOSW6uhxOpweEGR6QCglTivocTqcHhBkekBIail6Q8CrQ5xqlPUeTg1kr50YchFJDfrAIr0oegOPGUcoVTDuK5vv9F3RaWASG10Z4vXdhcE1qjJdd1k6ZI/u8ckJap3pRfcRL+yVkeu+UIXdRlldFVZvIhKDojrK6voNUr0BxMzprFRPrM7css7WRV0oEgNdGeE4ZHor7EzXlUHZqvtwgi5pVqfrD0h2d4hXEvNRP9n27fe8e9ZKtr9D/1efcXrXH2D3Hcr1zSdz2Os9vGf9B8MH4d6VdePCdSY8kYPTjykuN4DY5CjRm1Gf6dHIPv8+iQ2m91lw2gLiioFPD2g+aObjez7JINy1Z5/9r8n08XaD0W/4bIKR6Xa8LtyD3YXjkX2GGsvpaiI9KDiAXyk+u2A4fZoJGkb3dTqLCK/620vtqzKvatmLPrD9PFQv+sgz1zGcPtHLMozeK9PLRKdiGN1dp/fXsDrnwAdx29MtO+08sZxIa2Dpo7zlWDDdhdpjyMlTqnpPn+JdPSpZ7/A6e7dGPTVZphht37X/3upijO51ndgATh9K1l/4jDbEbCSKySIMtVJpMU3B6XOTW2w9XfmoBR2nu8qcp54QsUGe5D09Jm0es8TCfFo1ywqqRWW1eea6xBYZRh9E1kanJOSQKtAXu+Zy2zgQBNGKQSHMgdi45tBgBBvDhr0iLPhmSP6wh/B7r9Bu+KKDako1ElidF/fvv/+pp+wGfQnnPRKces6u5wvY15pefkf/eZab/vfZfOj58gvu752H6Wd8eUq9xO5nezuvmv55Ui/iR3s3+2mPsKReRstbOfFhhtRn0PFW9nM8r5RcmDM81/TLc8aPJNlKXV1//r1z/P84B19+PZNORNOBaDoQOx0okw4ktVUd9rsxezPpQOx0oEw6kCw/dqpNdjqYbAflkMakA8ndegWTSQeSTXCYdCC5wGXS6RyTzsROB2LSgZh0IJlV5bDGpAOx04GYdCCZpWgy6UBS8wLXSadzpkkHYqcDZdKBZPmxU62y06HkYf50Y7ZJJ2KnA2XSgWQKDpMOJNe4ULrbtklnYqcDMelATDoQkw7EpAPJuDvvkGaYdCJ2OhCTDiRjUzSZdCDZ1l8nndax05HY6UCZdCBZfuxUu0w6kKPTx2G/m7NNOhA7HSiTDiRDcJh0ILnIhdLdtU06EzsdiEkHYtKBZMw5j5luzDbpQOx0ICYdSMZ8a3U3Z5t0IFl+lXQ3bzsdScZUNJl0IJlzDoc1Jh2InQ6USQeS5cdONctOR6LpQDQdiJ0OlEkHoulANB2IpgPRdCCaDiS3+x+HNSYdiKYD0XQguY03DTdmm3QgeZh/x03ZJh1IbkPRZNKBZNwucqV0t22TDsROB8qkA8nyY6caZaf/Z7cOTB0HgiCITgornMA6E+Wf1PkwP4WVoV41zQSwKlpZ5kIOpgex6cEwPYhND8L0IEwPwvQgTA/C9CBMD/Ixfb+1VaYHselBmB5k9ltqYXqQefxXUo+X6UFsejBMDzKPf3ZyODY9yey939oq04PY9GCYHmQ2cjA9yPzAz6SeK9Or2PQgsy7UYHoQmx6E6UHmutalrTI9iE0PwvQgsy6phelB5vFfST1epgex6cEwPcg8/tnJ4dj0JLO+XG7nMj2ITQ+G6UFmIQfTg8xa19JWmR7EpgdhehCmB5m91/6P27lMD2LTgzA9yKwttTA9iE0PwvQgNj0YpgeZxz87OR6mB5lPt7bK9CA2PRimB/HoQTx6kPmBn0k9WZvexKMH8ehBZq8vbucyPYhHDzLfcy+3c5kexKMH8ehB5l5SC9ODzFo/8kvpHrtMD2LTg2F6kHn8s5PDselJ5r7vpa0yPYhND4bpQeb+Y7mVy/Qg8wM/k3qyNr3J3MjB9CBMD8L0IEwPwvQgTA8yryW1MD2ITQ/C9CA2PRimB5n1WuvTl9u5TA9i04NhepB5/LP7x24d2DYOQ0EQ/UW4E7OBg9h/TWcnqYESMG8WaxZAjZdyPEwP8t30l7bK9CA2PRimB5kXcjA9yDzgMakny/QmNj0I04MwPQjTgzA9yOx/UgvTg9j0IEwPYtODYXqQuf2zk+NhepDZ+/f6nZ2T6UFsejBMDzLff3ltlelBbHowTA8yGzmYHmQe8JjUk2V6E5sehOlBmB5k9ufmtVWmB7HpQZgeZPZLamF6kLn9KamHa9OT2PRgmB5kbv/s5HiYHuS76VtbZXoQmx4M04O49CAuPcjfpu/t7JxMD+LSg7j0IC49iEsP4tKDzPr8aKtMD+LSg7j0ILO21ML0ILPXA56TerA2PYlND4bpQeb2z06Oh+lBvpu+NFWbXsSmB8P0ILOQg+lB5v7HpB4t05vY9CBMD8L0IHPtvbVVpgex6UGYHmT2vn7i7JxMDzK3PyX1cG16krm21ML0ILOvhzwpncdOpgex6cEwPcjc/tnJwdj0LHMhB9OD2PRgmB7EpgdhehCm57DpSZgeZNaHt6bK9CA2PQjTg8x7SS1MDzLr/YDnpB6sTU9i04NhepBZ6/f6nZ3zP7t1YCJIDANBUOCEDA5h88/pD/5isA+6ahAKwDtoNT3ITQ9G04Pm+Wcnl+OmJ80hR9OD3PRgND3ITQ/S9CBND9L0IE0P0vQgTQ+a7zufaY2mB7npQZoeNOeTWjQ9aJ7/Sprro+lBbnowmh40zz87uRw3PWl+92dntpte5KYHo+lBHj3IowfNOd8xrdH0II8e5NGDPHqQRw/y6EFzzjqmNZoe5NGDPHrQrCO1aHrQPP+VNNdH04Pc9GA0PWief3ZyOW560qy1zvphd7amB7npwWh60CxyND1o1o8/8ENp39maXuWmB2l6kKYH/TZ9H7uzNT3ITQ/S9KDZR2rR9KB5/itpX9tuepibHoymB83zz06uR9ODZu99TGs0PchND0bTg2aTo+lBc97/TJqb46Y3uelBmh40Z1Oj6UFuetCsNcuURtOT3PQgTQ+aWZLLJmfWf3Zoa3qQm17MJuf5Ryf3o+lB82OZ2Gxynt8XcdO5YAja5Dz/kTSXx01vGoI2ObOGnE3OELTJGYq25ELQJmco2pILQf/ap2MigGEYCIJuAiQMBCWN+VNJkyIYfLs3P0KgUS2f3jRfy81cgka5SBrLjaBRLgDONJYbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8HNtUp5F0U3O2uS8TEEffQpz9pwAAAAASUVORK5CYII=</field><field name="url">/assets/phaser/samples/bg/bg_01.png</field></block>',
  general_sample_image_player:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAABaFBMVEUAAAACi/D////7/PsgcrvQ0NDBwsEeuZ3x8vLNy8sAAABdyk3p7PEEkuVekL0kccC343ba2tognqeQl5qG0RwBh/YqhXvFxcUdccMRsrJrbm/n5ubh4eHV1dUJntMswoTs7OwXuaQrgY2z4W80h2pLx1tlnC/39/fo6erd3d0ddMskbbQkeqsnwIh2vSAmk/wDj+q/y7fM6KO43n8sjXWIqltZyUwTi/wIhO0Gl94OmNALpscOrbshdrYnbK4ubak2bqJlhZ9AcJ0bvpsqfpXC45IqhYYjl4U4xHWRq240lWxDxWY/omBKo1FSqEhfxkSa2EBeqjpymzmQ1DRlpTBmky+EzSIej/oqiuPi4uITfOLm7tycuNFqm8gXj8cahMTT4b/W7bTK3LOwsLAcn6+zwacXsaZLeJ4pfZ0cpZupu5U4apUcq5IueYmetII3nGpMtFSf101/pUhszEJ4zz+D0TyBtTVupCWk42KvAAAAAXRSTlMAQObYZgAAAe9JREFUOMu11FdX2zAYgGE5iosDSYux8TZJHNvZiwxGKS2FsltGge699y5/H8kDPJSrhPdGuniOjvzpHIPLb5qKNj1Izsj5sWB5eXGeKOda+brVn7iob9U/vaiQaLO1avH7hUm/wq+Tnxu1KiBF5a37szDhB1//vyfUbpKpvLP/Cp5L2D68K9y4Rf6spU106vh4Gku0vDveFZK3yfT65r/Z4gX9fLy7LoEBNPv3DuNSfPh3+4eRHDTX7J8g3TraXhtA5xbqex2P4nv0Drofq4Dcwmq/k0unIUzANOr3gVBbDosk5W0yeavwhFGKEDIlpdQ+PB8rlYzSlrxz0nnJKaqqKlx76xSPNUqb3hss1fcajR6nKArXazSOttfdsTZdWqVQmYw7gsX3X7umKXAcJ5im2d34Jn1wLoZNFSRRvn0w//ztFEqW5Snc2rK04kqsAA5jxz58XLkWqFL5wjnSdSH79NnVUCuc6MuoLaeuhBJZX0ZtuZxjguU01pMxy6owXI6l4xJbrczARDBY1FJYxi2rIRm2qk6T6CO2BKMxbIpEWZZRU+H0nEbrBKrrdKwUrYukU2lS4hsCLXnzj73CcEkS5TaD8raSBIbNMMacsihnYxhgFNn2BIpHocW2wcjiefQXLkzyPBhtWkIUE2CYzgD3vELlgidxEwAAAABJRU5ErkJggg==</field><field name="url">/assets/phaser/samples/player.png</field></block>',
  general_sample_image_paddle:
    '<block type="static_image_file"><field name="urlData">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAeCAMAAADthUvBAAABI1BMVEUAAAArKSkrKiksKyorKiksKyorKykrKikrKigvLy0oJiYoKCQ5ODcrKikxMTEtLSosLCk8PDu3trZ4eHdFREMyMjEsKipNTUt/f38oJCRYVlaLi4lzcnGmpqVJSEejoqIrKipoZmYrKilGRUVEQ0MvLi2FhoZXVlVqammZmppiYWBmZWU3NjaIiYl3eHg1NDP+/v5UVFRPT08/Pj5KSUlZWVk6OTlmZmbu7u6gn5+3traMjIz39/fd3NzCwsLh4eGAgID09PS+v77p6enKysqvr6+qqqqmpqajo6OSkpJ6enpycXH5+fnm5uaWlZVtbWxjY2Lx8fHk4+PW1tZ0dHNMTEvS0tLPz8+6urp9fHyXl5eHh4fY2NjFxcWzsrKPjo7Hx8eG6ZG7AAAAInRSTlMAYfH35sxu2ZhOLBXqeFZAN/X06sWtin5YJPPx8e7p4beBnAdZ7gAAA3hJREFUSMe91WdT20AQBmDFgCGk995k2XIB6U7yndVluffeC/D/f0X2TnZITPIl0eT5cLu3MLxzsx4s/HdPH8fPXj+694/ir8/ij58++G3Ck5fPXojR+fzy3t1HPPwwQigRHeR/OjqIefXCQSAbHQS+vBFunb99PuIh6egg5vm3c2HvjerNuixFjg5iDPXtPuP+e7PqjcsdhKToIDB0Kx8fC9yDh0vbvIIUhJIhPcFOCav8AuUQlXVWVCwl/wQyAn++qD8MP8sncnp5bVo3m/I+pJSBoxeMuloyaQejspz8Vc7wg2YymfdHgfnnkM5oVqqtWif8Icd50i82G9aNa6iMbiFTVUmgqeZclR2s9sbqL2h5rWJHVr26OjVy6u8hVB571cx6EmMh944ueErdqriUcStbk1LTojSBpiuPUh3JMMYpndIioTCuQ+cvdYQprVUpkNMFE36sDCglS8ohY7O9Mm1l8Ow+hHwVRTrNtlO9+qKiM4puNXTdy0Bbbi8aUEYtOCTf1G1jqoeUAOccqNdzdrO77sr19EtjmuhmdA6WbpnXrQKmryDkWNyn1BZSaFGXpHkTGj91k4HiXrJp25kEKSlkoJo0MaBZu+x67WAJO2lpblXdhMSxpTeLaVlKHkOIyOhadpJa1fKhUj2fn/Wg8VMVE4pr8/EVusnvkLbRUwxobJddmxU45r38wOn08yG29FSfJFRR5CFhymCyzmihUk3Ttg1ojCVrtW6Kj5uorv3QGLcdKJkZu/Q8OCqmhrsG0UJ86dnphSiyj1dMZJI6zimXOORVMa55GGfRoFHBmKA0BoOh5fRZM9nIGDfGBMHNsjBYbeDwbVwdzRY4xJeuUfjTRxByKt6mkJBXJURxFGKNSdtZkqpLmO2MlMasyQ5N0i83SKVE2kGRgAxak2YwUFCx3UkRji9dF8EphDwSQ6okF3a2Fhy1zrC8LBTqnaFRZMNep1VoDxustQ2jU0oXlG7QsQpMo9s1hs20XyoUrsp9PgqXLoIz9mV1fJui/Kxot/blUMsu8gqFq7qtw98Klw5i7wS+lB01cfmXLP/OiC+dC/8J/0i5yPyl0ubOiC2dicUF7kTcS0WHLZ0Tdo7EnVx02NL553fvXNxJREe9fcfBWy6iE77jXPiZGBMjFzsRDsSjjjmO3Rfuend2ehTZI04fPRH+r+8h1riDoCbzLwAAAABJRU5ErkJggg==</field><field name="filename">paddle.png</field><field name="url">/assets/phaser/samples/paddle.png</field></block>',
};

/**
 * @param {string} xml
 * @return {string}
 */
export function replaceGeneralSampleImageBlock(xml) {
  // Replace old example blocks with new ones.
  for (const [oldBlock, newBlock] of Object.entries(generalSampleImageBlocks)) {
    xml = xml.replaceAll(`<block type="${oldBlock}"></block>`, newBlock);
  }
  return xml;
}

/**
 * @param {string} xml
 * @param {Map<string, string>} files
 * @return {string}
 */
export function replaceGeneralFileLibraryAudioBlock(xml, files = new Map()) {
  let match;
  const regex =
    /<block type="general_file_library_audio">\s*<field name="filename">([^<]*)<\/field>\s*<\/block>/g;
  while ((match = regex.exec(xml))) {
    const filename = match[1].replaceAll('\\"', '').replaceAll('"', '');
    const file = files.get(filename);
    xml = xml.replace(
      match[0],
      `<block type="dynamic_audio_file"><field name="filename">${filename}</field><field name="url">${filename}</field><field name="urlData">${file}</field></block>`
    );
  }

  return xml;
}

/**
 * @param {string} xml
 * @param {Map<string, string>} files+
 * @return {string}
 */
export function replaceGeneralFileLibraryImageBlock(xml, files = new Map()) {
  let match;
  const regex =
    /<block type="general_file_library_image">\s*<field name="filename">([^<]*)<\/field>\s*<field name="preview">([^<]*)<\/field>\s*<\/block>/g;
  while ((match = regex.exec(xml))) {
    const filename = match[1].replaceAll('\\"', '').replaceAll('"', '');
    const file = match[2] || files.get(filename);
    xml = xml.replace(
      match[0],
      `<block type="dynamic_image_file"><field name="filename">${filename}</field><field name="url">${filename}</field><field name="urlData">${file}</field></block>`
    );
  }
  return xml;
}

/**
 * @param {string} xml
 * @param {Map<string, string>} files
 * @return {string}
 */
export function replaceLegacyBlocks(xml, files = new Map()) {
  if (xml.includes('general_sample_image_')) {
    console.log('Replacing general sample image blocks...');
    xml = replaceGeneralSampleImageBlock(xml);
  }
  if (xml.includes('general_file_library_audio')) {
    console.log('Replacing general file library audio blocks...');
    xml = replaceGeneralFileLibraryAudioBlock(xml, files);
  }
  if (xml.includes('general_file_library_image')) {
    console.log('Replacing general file library image blocks...');
    xml = replaceGeneralFileLibraryImageBlock(xml, files);
  }
  return xml;
}

export default {
  replaceLegacyBlocks,
};
