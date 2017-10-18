# NgxNaverMap

앵귤러 네이버지도임

Map이랑 Marker만 건드려 봤습니다

# Install :
```
npm install ngx-naver-map
```


# Example

### MainModule :
```
//AnmCoreModule 임포트
import {AnmCoreModule} from 'ngx-naver-map';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //apiKey입력 
    AnmCoreModule.forRoot({
      apiKey: '이곳에 네이버지도 api키를 입력하세요'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### HTML :
```
//*anm-map의 style:height는 필수로 입력해야 합니다.(px로!)!!*
//Event는 (Event이름)="Method이름()" 의 형식으로 붙일 수 있습니다
<anm-map (bounds_changed)="onBoundsChanged($event)" [latitude]="37" [longitude]="127" style="height: 300px"> 

    <anm-marker [latitude]="37" [longitude]="127">

        <anm-info-window [disableAutoPan]="true">
           Hi, this is the content of the <strong>info window</strong>
         </anm-info-window>

    </anm-marker>

</anm-map>
```

### TS :
```
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-comp',
  templateUrl: './app-comp.html',
  styleUrls: ['./app-comp.css']
})
export class AppComponent {

  bounds_changed(event) {
  
    console.log(event);
    
  }
  
  constructor() {}

}

```






