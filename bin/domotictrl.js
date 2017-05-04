/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 *
 *  author = "Laura Sánchez Morales"
 *  date = "$Nov 21, 2016 9:00:45 AM$"
 *
 */


domotictrl = ( function ()
{

//class PanelItem
function PanelItem (Width, Height, Text, Image)
{
    Gwt.Gui.Frame.call (this);

    this.Layout = new Gwt.Gui.HBox (12);
    this.Text = new Gwt.Gui.StaticText (Text);
    this.Image = new Gwt.Gui.Image (Image);

    this.SetSize (Width, Height);
    this.SetBorderColor (new Gwt.Gui.Contrib.Color (20, 20, 25, 0.9));
    this.SetBorderBottom (1);

    this.Layout.SetSize (this.GetWidth(), this.GetHeight ());
    this.Layout.SetAlignment (Gwt.Gui.ALIGN_CENTER);
    this.Add (this.Layout);

    this.Text.SetExpand (false);
    this.Text.SetWidth (this.GetWidth () - 80, 24);
    this.Text.SetMarginLeft (12);

    this.Layout.Add (this.Text);

    this.Image.SetSize (32, 32);
    this.Image.SetMarginRight (24);
    this.Layout.Add (this.Image);
}

PanelItem.prototype = new Gwt.Gui.Frame ();
PanelItem.prototype.constructor = PanelItem;

PanelItem.prototype._PanelItem = function ()
{
    this.Text._StaticText();
    this.Image._Image();
    this.Layout._HBox();

    this.Text = null;
    this.Image = null;
    this.Layout = null;

    this._Frame ();
};


//class VentiladorCtrl
function VentiladorCtrl ()
{
    Gwt.Gui.Frame.call (this);
    //instance props
    this.Knob = new  Gwt.Gui.KnobThreeLevels ();
    this.Direccion = 0;

    //methods
    this.SetSize (200, 200);
    this.SetMarginTop (16);
    this.Add (this.Knob);

    this.Knob.AddEvent (Gwt.Gui.Event.Form.ContextMenu, this.EventKnobContextMenu.bind (this));
    this.Knob.AddEvent (Gwt.Gui.Event.Mouse.MouseDown, this.EventKnobClick.bind (this));

    new Gwt.Core.Rpc('/serverstate').Send({}, this.InitState.bind(this));
}

VentiladorCtrl.prototype = new Gwt.Gui.Frame ();
VentiladorCtrl.prototype.constructor = VentiladorCtrl;

VentiladorCtrl.prototype.InitState = function (Res)
{
    if(Res.VentiladorLevel === 0)
    {
        this.Knob.SetOff ();
    }
    else if(Res.VentiladorLevel === 1)
    {
        this.Knob.SetOne ();
    }
    else if(Res.VentiladorLevel === 2)
    {
        this.Knob.SetTwo ();
    }
    else if(Res.VentiladorLevel === 3)
    {
        this.Knob.SetThree ();
    }
    else
    {
        console.log ("Ventilador Estado Inicial No Definido");
    }
};

VentiladorCtrl.prototype.EventKnobClick = function (Event)
{
    if (this.Direccion === 0)
    {
        if(this.Knob.GetLevel () === 0)
        {
            this.Knob.SetOne ();
            new Gwt.Core.Rpc('/ventiladorctrl/1').Send({}, function (Res){console.log(Res);});
        }

        else if (this.Knob.GetLevel () === 1)
        {
            this.Knob.SetTwo ();
            new Gwt.Core.Rpc('/ventiladorctrl/2').Send({}, function (Res){console.log(Res);});
        }

        else if (this.Knob.GetLevel () === 2)
        {
            this.Knob.SetThree ();
            new Gwt.Core.Rpc('/ventiladorctrl/3').Send({}, function (Res){console.log(Res);});
            this.Direccion = 1;
        }

        else if (this.Knob.GetLevel () === 3)
        {
            this.Knob.SetTwo ();
            new Gwt.Core.Rpc('/ventiladorctrl/2').Send({}, function (Res){console.log(Res);});
            this.Direccion = 1;
        }

        else
        {
            console.log ("Knob Status Not Defined");
        }
    }
    else
    {
        if(this.Knob.GetLevel () === 3)
        {
            this.Knob.SetTwo ();
            new Gwt.Core.Rpc('/ventiladorctrl/2').Send({}, function (Res){console.log(Res);});
        }

        else if (this.Knob.GetLevel () === 2)
        {
            this.Knob.SetOne ();
            new Gwt.Core.Rpc('/ventiladorctrl/1').Send({}, function (Res){console.log(Res);});
        }

        else if (this.Knob.GetLevel () === 1)
        {
            this.Knob.SetOff ();
            new Gwt.Core.Rpc('/ventiladorctrl/0').Send({}, function (Res){console.log(Res);});
            this.Direccion = 0;
        }

        else if (this.Knob.GetLevel () === 0)
        {
            this.Knob.SetOne ();
            new Gwt.Core.Rpc('/ventiladorctrl/1').Send({}, function (Res){console.log(Res);});
            this.Direccion = 0;
        }

        else
        {
            console.log ("Knob Status Not Defined");
        }
    }
};

VentiladorCtrl.prototype.EventKnobContextMenu = function (Event)
{
    Event.preventDefault ();
};



//class VentanasCtrl
function VentanasCtrl ()
{
    Gwt.Gui.Frame.call (this);
    //instance props
    this.Container = new Gwt.Gui.VBox (12);
    this.BtnAbrir = new Gwt.Gui.Button (Gwt.Core.Contrib.Images + "appbar.window.casement.svg", "Abrir");
    this.BtnCerrar = new Gwt.Gui.Button (Gwt.Core.Contrib.Images + "appbar.window.casement.closed.svg", "Cerrar");
    this.BtnParar = new Gwt.Gui.Button (Gwt.Core.Contrib.Images + "appbar.timer.svg", "Parar");

    //methods
    this.SetSize (200, 200);
    this.SetMarginTop (16);

    this.Container.SetSize (this.GetWidth(), this.GetHeight ());
    this.Container.SetAlignment (Gwt.Gui.ALIGN_CENTER);
    this.Add (this.Container);

    this.BtnAbrir.SetWidth (96);
    this.BtnAbrir.SetMarginTop (24);
    this.Container.Add(this.BtnAbrir);

    this.BtnCerrar.SetWidth (96);
    this.Container.Add (this.BtnCerrar);

    this.BtnParar.SetWidth (96);
    this.Container.Add (this.BtnParar);

    this.BtnAbrir.AddEvent (Gwt.Gui.Event.Mouse.Click, this.AbrirEvent.bind(this));
    this.BtnCerrar.AddEvent (Gwt.Gui.Event.Mouse.Click, this.CerrarEvent.bind(this));
    this.BtnParar.AddEvent (Gwt.Gui.Event.Mouse.Click, this.PararEvent.bind(this));
}

VentanasCtrl.prototype = new Gwt.Gui.Frame ();
VentanasCtrl.prototype.constructor = VentanasCtrl;

VentanasCtrl.prototype.AbrirEvent = function ()
{
    new Gwt.Core.Rpc('/ventanasctrl/abrir').Send({}, function (Res){console.log(Res);});
};

VentanasCtrl.prototype.CerrarEvent = function ()
{
    new Gwt.Core.Rpc('/ventanasctrl/cerrar').Send({}, function (Res){console.log(Res);});
};

VentanasCtrl.prototype.PararEvent = function ()
{
    new Gwt.Core.Rpc('/ventanasctrl/parar').Send({}, function (Res){console.log(Res);});
};


//class LuzCtrl
function LuzCtrl ()
{
    Gwt.Gui.Frame.call (this);

    //instance props
    this.Btn1State = false;
    this.Btn2State = false;
    this.Btn3State = false;
    this.Btn4State = false;
    this.Btn5State = false;

    this.Container = new Gwt.Gui.VBox(7);
    this.Row1 = new Gwt.Gui.HBox (7);
    this.Row2 = new Gwt.Gui.HBox (7);
    this.Row3 = new Gwt.Gui.HBox (7);
    this.Row4 = new Gwt.Gui.HBox (7);
    this.Row5 = new Gwt.Gui.HBox (7);

    this.Text1 = new Gwt.Gui.StaticText ("Bombillo 1");
    this.Text2 = new Gwt.Gui.StaticText ("Bombillo 2");
    this.Text3 = new Gwt.Gui.StaticText ("Bombillo 3");
    this.Text4 = new Gwt.Gui.StaticText ("Bombillo 4");
    this.Text5 = new Gwt.Gui.StaticText ("Bombillo 5");

    this.BtnBulb1 = new Gwt.Gui.ButtonOnOff ();
    this.BtnBulb2 = new Gwt.Gui.ButtonOnOff ();
    this.BtnBulb3 = new Gwt.Gui.ButtonOnOff ();
    this.BtnBulb4 = new Gwt.Gui.ButtonOnOff ();
    this.BtnBulb5 = new Gwt.Gui.ButtonOnOff ();

    //methods
    this.SetSize (200, 200);
    this.SetMarginTop (16);

    this.Container.SetSize (this.GetWidth (), this.GetHeight ());
    this.Add (this.Container);

    this.Container.Add (this.Row1);
    this.Container.Add (this.Row2);
    this.Container.Add (this.Row3);
    this.Container.Add (this.Row4);
    this.Container.Add (this.Row5);

    this.Text1.SetSize (140, 26);
    this.Text1.SetExpand (false);
    this.Row1.Add (this.Text1);
    this.Row1.Add (this.BtnBulb1);

    this.Text2.SetSize (140, 26);
    this.Text2.SetExpand (false);
    this.Row2.Add (this.Text2);
    this.Row2.Add (this.BtnBulb2);

    this.Text3.SetSize (140, 26);
    this.Text3.SetExpand (false);
    this.Row3.Add (this.Text3);
    this.Row3.Add (this.BtnBulb3);

    this.Text4.SetSize (140, 26);
    this.Text4.SetExpand (false);
    this.Row4.Add (this.Text4);
    this.Row4.Add (this.BtnBulb4);

    this.Text5.SetSize (140, 26);
    this.Text5.SetExpand (false);
    this.Row5.Add (this.Text5);
    this.Row5.Add (this.BtnBulb5);

    this.BtnBulb1.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn1Event.bind(this));
    this.BtnBulb2.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn2Event.bind(this));
    this.BtnBulb3.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn3Event.bind(this));
    this.BtnBulb4.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn4Event.bind(this));
    this.BtnBulb5.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn5Event.bind(this));

    new Gwt.Core.Rpc('/serverstate').Send({}, this.InitState.bind(this));

    clearInterval (window.LuzCtrlMonitor);
    window.LuzCtrlMonitor = setInterval (this.LuzCtrlMonitor.bind (this), 2000);
}

LuzCtrl.prototype = new Gwt.Gui.Frame ();
LuzCtrl.prototype.constructor = LuzCtrl;

LuzCtrl.prototype.LuzCtrlMonitor = function ()
{
    new Gwt.Core.Rpc('/serverstate').Send({}, this.InitState.bind(this));
};

LuzCtrl.prototype.InitState = function (Res)
{
    if (Res.Bombillo1 === 1)
    {
        this.BtnBulb1.SetOn ();
        this.Btn1State = true;
    }
    else
    {
        this.BtnBulb1.SetOff ();
        this.Btn1State = false;
    }

    if (Res.Bombillo2 === 1)
    {
        this.BtnBulb2.SetOn ();
        this.Btn2State = true;
    }
    else
    {
        this.BtnBulb2.SetOff ();
        this.Btn2State = false;
    }

    if (Res.Bombillo3 === 1)
    {
        this.BtnBulb3.SetOn ();
        this.Btn3State = true;
    }
    else
    {
        this.BtnBulb3.SetOff ();
        this.Btn3State = false;
    }

    if (Res.Bombillo4 === 1)
    {
        this.BtnBulb4.SetOn ();
        this.Btn4State = true;
    }
    else
    {
        this.BtnBulb4.SetOff ();
        this.Btn4State = false;
    }

    if (Res.Bombillo5 === 1)
    {
        this.BtnBulb5.SetOn ();
        this.Btn5State = true;
    }
    else
    {
        this.BtnBulb5.SetOff ();
        this.Btn5State = false;
    }
};

LuzCtrl.prototype.Btn1Event = function ()
{
    if(!this.Btn1State)
    {
        this.BtnBulb1.SetOn ();
        this.Btn1State = true;
        new Gwt.Core.Rpc('/bombillosctrl/1').Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.BtnBulb1.SetOff ();
        this.Btn1State = false;
        new Gwt.Core.Rpc('/bombillosctrl/1').Send({}, function (Res){console.log(Res);});
    }
};

LuzCtrl.prototype.Btn2Event = function ()
{
    if(!this.Btn2State)
    {
        this.BtnBulb2.SetOn ();
        this.Btn2State = true;
        new Gwt.Core.Rpc('/bombillosctrl/2').Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.BtnBulb2.SetOff ();
        this.Btn2State = false;
        new Gwt.Core.Rpc('/bombillosctrl/2').Send({}, function (Res){console.log(Res);});
    }
};

LuzCtrl.prototype.Btn3Event = function ()
{
    if(!this.Btn3State)
    {
        this.BtnBulb3.SetOn ();
        this.Btn3State = true;
        new Gwt.Core.Rpc('/bombillosctrl/3').Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.BtnBulb3.SetOff ();
        this.Btn3State = false;
        new Gwt.Core.Rpc('/bombillosctrl/3').Send({}, function (Res){console.log(Res);});
    }
};

LuzCtrl.prototype.Btn4Event = function ()
{
    if(!this.Btn4State)
    {
        this.BtnBulb4.SetOn ();
        this.Btn4State = true;
        new Gwt.Core.Rpc('/bombillosctrl/4').Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.BtnBulb4.SetOff ();
        this.Btn4State = false;
        new Gwt.Core.Rpc('/bombillosctrl/4').Send({}, function (Res){console.log(Res);});
    }
};

LuzCtrl.prototype.Btn5Event = function ()
{
    if(!this.Btn5State)
    {
        this.BtnBulb5.SetOn ();
        this.Btn5State = true;
        new Gwt.Core.Rpc('/bombillosctrl/5').Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.BtnBulb5.SetOff ();
        this.Btn5State = false;
        new Gwt.Core.Rpc('/bombillosctrl/5').Send({}, function (Res){console.log(Res);});
    }
};


//class VentanasCtrl
function PersianasCtrl ()
{
    Gwt.Gui.Frame.call (this);
    //instance props
    this.Container = new Gwt.Gui.VBox (12);
    this.BtnAbrir = new Gwt.Gui.Button (Gwt.Core.Contrib.Images + "appbar.list.reorder.down.svg", "Abrir");
    this.BtnCerrar = new Gwt.Gui.Button (Gwt.Core.Contrib.Images + "appbar.list.reorder.up.svg", "Cerrar");
    this.BtnParar = new Gwt.Gui.Button (Gwt.Core.Contrib.Images + "appbar.timer.svg", "Parar");

    //methods
    this.SetSize (200, 200);
    this.SetMarginTop (16);

    this.Container.SetSize (this.GetWidth(), this.GetHeight ());
    this.Container.SetAlignment (Gwt.Gui.ALIGN_CENTER);
    this.Add (this.Container);

    this.BtnAbrir.SetWidth (96);
    this.BtnAbrir.SetMarginTop (24);
    this.Container.Add(this.BtnAbrir);

    this.BtnCerrar.SetWidth (96);
    this.Container.Add (this.BtnCerrar);

    this.BtnParar.SetWidth (96);
    this.Container.Add (this.BtnParar);

    this.BtnAbrir.AddEvent (Gwt.Gui.Event.Mouse.Click, this.AbrirEvent.bind(this));
    this.BtnCerrar.AddEvent (Gwt.Gui.Event.Mouse.Click, this.CerrarEvent.bind(this));
    this.BtnParar.AddEvent (Gwt.Gui.Event.Mouse.Click, this.PararEvent.bind(this));
}

PersianasCtrl.prototype = new Gwt.Gui.Frame ();
PersianasCtrl.prototype.constructor = PersianasCtrl;

PersianasCtrl.prototype.AbrirEvent = function ()
{
    new Gwt.Core.Rpc('/persianasctrl/abrir').Send({}, function (Res){console.log(Res);});
};

PersianasCtrl.prototype.CerrarEvent = function ()
{
    new Gwt.Core.Rpc('/persianasctrl/cerrar').Send({}, function (Res){console.log(Res);});
};

PersianasCtrl.prototype.PararEvent = function ()
{
    new Gwt.Core.Rpc('/persianasctrl/parar').Send({}, function (Res){console.log(Res);});
};

function WidgetClock ()
{
    Gwt.Gui.Frame.call (this);
    this.SetSize (180, 24);

    this.TimeAlarm = null;
    var Hrs = [
      {"Text": "01", "Value": 1}, {"Text": "02", "Value": 2}, {"Text": "03", "Value": 3},
      {"Text": "04", "Value": 4}, {"Text": "05", "Value": 5}, {"Text": "06", "Value": 6},
      {"Text": "07", "Value": 7}, {"Text": "08", "Value": 8}, {"Text": "09", "Value": 9},
      {"Text": "10", "Value": 10}, {"Text": "11", "Value": 11}, {"Text": "12", "Value": 12}
    ];
    this.Hours = new Gwt.Gui.IconSelectBox (Gwt.Core.Contrib.Images+"appbar.clock.svg", "Hr", Hrs);
    this.Hours.SetWidth (50);
    this.Separator = new Gwt.Gui.StaticText (":");
    this.Separator.SetWidth (8);
    var Mins = [
      {"Text": "00", "Value": 0}, {"Text": "05", "Value": 5}, {"Text": "10", "Value": 10},
      {"Text": "15", "Value": 15}, {"Text": "20", "Value": 20}, {"Text": "25", "Value": 25},
      {"Text": "30", "Value": 30}, {"Text": "35", "Value": 35}, {"Text": "40", "Value": 40},
      {"Text": "45", "Value": 45}, {"Text": "50", "Value": 50}, {"Text": "55", "Value": 55}
    ];
    this.Mins = new Gwt.Gui.SelectBox ("Min", Mins);
    this.Mins.SetWidth (30);
    this.AmPm = new Gwt.Gui.SelectBox ("AM/PM", [{"Text": "A.M", "Value": 0}, {"Text": "P.M", "Value": 1}]);
    this.AmPm.SetWidth (60);

    this.Container = new Gwt.Gui.HBox (3);
    this.Container.SetSize (this.GetWidth (), this.GetHeight ());
    this.Add (this.Container);

    this.Container.Add (this.Hours);
    this.Container.Add (this.Separator);
    this.Container.Add (this.Mins);
    this.Container.Add (this.AmPm);

    new Gwt.Core.Rpc('/serverstate').Send({}, this.InitState.bind(this));
}

WidgetClock.prototype = new Gwt.Gui.Frame();
WidgetClock.prototype.constructor = WidgetClock;

WidgetClock.prototype.InitState = function (Res)
{
    if (Res.Alarma !== "00_00_mm")
    {
        var a = Res.Alarm.split ("_");

        this.Hours.SetText (Number(a[0]));
        this.Mins.SetText (Number(a[1]));
        this.AmPm.SetText (Number(a[2]));
    }
}

WidgetClock.prototype.SetOn = function ()
{
    var Hour = this.Hours.GetText ();
    var Minutes = this.Mins.GetText ();
    var AmPm = this.AmPm.GetText();

    if (Hour==="" || Minutes==="" || AmPm==="")
    {
      return false;
    }

    if(AmPm === 1)
    {
        Hour = Hour+12;
    }

    if (Hour === 24)
    {
        Hour = 0;
    }

    var Now = new Date ();
    var Hnow = Now.getHours ();
    var Mnow = Now.getMinutes ();
    var Snow = Now.getSeconds ();

    var ElapsedHours = 0;
    var ElapsedMinutes = 0;

    if (Hour > Hnow)
    {
        ElapsedHours = Hour-Hnow;
    }
    else if (Hour < Hnow)
    {
        ElapsedHours = ((24-Hnow)+Hour)-1;
    }
    else
    {
        ElapsedHours = 0;
    }

    if (Minutes > Mnow)
    {
        ElapsedMinutes = Minutes - Mnow;
    }
    else if (Minutes < Mnow)
    {
        ElapsedMinutes = 60 - Mnow + Minutes;
    }
    else
    {
        ElapsedMinutes = 0;
    }

    var Seconds = (ElapsedHours*3600) + (ElapsedMinutes*60) - Snow;

    if(Seconds < 0)
    {
        Seconds=0;
    }

    var Alarm = ""+Hour+"_"+Minutes+"_"+AmPm
    console.log (Seconds);
    new Gwt.Core.Rpc('/alarmactrl/on/'+Seconds+"/"+Alarm).Send({}, function (Res){console.log(Res);});
    //this.TimeAlarm = setTimeout (function (){console.log ("tic tic, tic tic, tic tic...");}, Seconds*1000);

    return true;
}

WidgetClock.prototype.SetOff = function ()
{
    new Gwt.Core.Rpc('/alarmactrl/off/'+0+"/00_00_mm").Send({}, function (Res){console.log(Res);});
    if (this.TimeAlarm !== null)
    {
      //clearTimeout (this.TimeAlarm);
      //this.TimeAlarm = null;
    }
}

//class EscenasCtrl
function EscenasCtrl ()
{
    Gwt.Gui.Frame.call (this);

    //instance props
    this.Btn1State = false;
    this.Btn2State = false;
    this.Btn3State = false;
    this.TimerVacaiones = null;
    this.Luz1 = null;
    this.Luz2 = null;

    this.Container = new Gwt.Gui.VBox(7);
    this.Row1 = new Gwt.Gui.HBox (7);
    this.Row2 = new Gwt.Gui.HBox (7);
    this.Row3 = new Gwt.Gui.HBox (7);
    this.Row4 = new Gwt.Gui.HBox (7);

    this.Text1 = new Gwt.Gui.StaticText ("Vacaciones");
    this.Text2 = new Gwt.Gui.StaticText ("Alarma");
    this.Text3 = new Gwt.Gui.StaticText ("LLegando a casa");

    this.BtnEscena1 = new Gwt.Gui.ButtonOnOff ();
    this.BtnEscena2 = new Gwt.Gui.ButtonOnOff ();
    this.Clock = new WidgetClock ();
    this.BtnEscena3 = new Gwt.Gui.ButtonOnOff ();

    //methods
    this.SetSize (200, 200);
    this.SetMarginTop (16);

    this.Container.SetSize (this.GetWidth (), this.GetHeight ());
    this.Add (this.Container);

    this.Container.Add (this.Row1);
    this.Container.Add (this.Row2);
    this.Container.Add (this.Row3);
    this.Container.Add (this.Row4);

    this.Text1.SetSize (140, 26);
    this.Text1.SetExpand (false);
    this.Row1.Add (this.Text1);
    this.Row1.Add (this.BtnEscena1);

    this.Row2.Add (this.Clock);

    this.Text2.SetSize (140, 26);
    this.Text2.SetExpand (false);
    this.Row3.Add (this.Text2);
    this.Row3.Add (this.BtnEscena2);

    this.Text3.SetSize (140, 26);
    this.Text3.SetExpand (false);
    this.Row4.Add (this.Text3);
    this.Row4.Add (this.BtnEscena3);

    this.BtnEscena1.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn1Event.bind(this));
    this.BtnEscena2.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn2Event.bind(this));
    this.BtnEscena3.AddEvent (Gwt.Gui.Event.Mouse.Click, this.Btn3Event.bind(this));
    //new Gwt.Core.Rpc('/serverstate').Send({}, this.InitState.bind(this));

    //clearInterval (window.LuzCtrlMonitor);
    //window.LuzCtrlMonitor = setInterval (this.LuzCtrlMonitor.bind (this), 2000);
    new Gwt.Core.Rpc('/serverstate').Send({}, this.InitState.bind(this));

}

EscenasCtrl.prototype = new Gwt.Gui.Frame ();
EscenasCtrl.prototype.constructor = EscenasCtrl;

EscenasCtrl.prototype.InitState = function (Res)
{
    if(Res.Viaje === "on")
    {
        this.BtnEscena1.SetOn ();
        this.TimerVacaiones = setInterval (this.LuzAleatoria.bind(this), 1000*10);
    }

    if (Res.Alarma !== "00_00_mm")
    {
        this.BtnEscena2.SetOn ();
    }
}

//Btn1 event
EscenasCtrl.prototype.Btn1Event = function ()
{
    if(!this.Btn1State)
    {
        this.BtnEscena1.SetOn ();
        this.Btn1State = true;
        this.TimerVacaiones = setInterval (this.LuzAleatoria.bind(this), 1000*10);
        new Gwt.Core.Rpc('/viajectrl/on').Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.BtnEscena1.SetOff ();
        this.Btn1State = false;
        clearInterval (this.TimerVacaiones);
        new Gwt.Core.Rpc('/viajectrl/off').Send({}, function (Res){console.log(Res);});
    }
};

//Btn2 event
EscenasCtrl.prototype.Btn2Event = function ()
{
    if(!this.Btn2State)
    {
        if (!this.Clock.SetOn ())
        {
            return;
        }
        this.BtnEscena2.SetOn ();
        this.Btn2State = true;
        //new Gwt.Core.Rpc('/bombillosctrl/1').Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.BtnEscena2.SetOff ();
        this.Btn2State = false;
        this.Clock.SetOff ();
        //new Gwt.Core.Rpc('/bombillosctrl/1').Send({}, function (Res){console.log(Res);});
    }
};

//Btn2 event
EscenasCtrl.prototype.Btn3Event = function ()
{
    if(!this.Btn3State)
    {
        this.BtnEscena3.SetOn ();
        this.Btn3State = true;
        new Gwt.Core.Rpc('/bombillosctrl/1').Send({}, function (Res){console.log(Res);});
        new Gwt.Core.Rpc('/ventanasctrl/abrir').Send({}, function (Res){console.log(Res);});
        new Gwt.Core.Rpc('/persianasctrl/abrir').Send({}, function (Res){console.log(Res);});
        var a = setTimeout (this.Btn3Event.bind(this), 3000);
    }
    else
    {
        this.BtnEscena3.SetOff ();
        this.Btn3State = false;
    }
};

EscenasCtrl.prototype.LuzAleatoria = function ()
{
    //console.log ("luz aleatoria");
    var Luz1Antigua = 0;
    var Luz2Antigua = 0;

    if (this.Luz1 !== null && this.Luz2 !== null)
    {
        Luz1Antigua = this.Luz1;
        Luz2Antigua = this.Luz2;
        console.log ("Apagando luz1 : %0, luz2 : %1".replace("%0", this.Luz1).replace("%1", this.Luz2));
        new Gwt.Core.Rpc('/bombillosctrl/%0'.replace("%0", this.Luz1)).Send({}, function (Res){console.log(Res);});
        new Gwt.Core.Rpc('/bombillosctrl/%0'.replace("%0", this.Luz2)).Send({}, function (Res){console.log(Res);});
    }
    else
    {
        this.Luz1 = 1;
        this.Luz2 = 2;
    }

    this.Luz1 = Gwt.Core.Contrib.RandomInt (1,5);
    while (this.Luz1===Luz1Antigua || this.Luz1===Luz2Antigua)
    {
        this.Luz1 = Gwt.Core.Contrib.RandomInt (1,5);
    }

    this.Luz2 = Gwt.Core.Contrib.RandomInt (1,5);
    while (this.Luz2===Luz2Antigua || this.Luz2===this.Luz1 || this.Luz2===Luz1Antigua)
    {
        this.Luz2 = Gwt.Core.Contrib.RandomInt (1,5);
    }
    console.log ("Encendiendo luz1 : %0, luz2 : %1".replace("%0", this.Luz1).replace("%1", this.Luz2));
    new Gwt.Core.Rpc('/bombillosctrl/%0'.replace("%0", this.Luz1)).Send({}, function (Res){console.log(Res);});
    new Gwt.Core.Rpc('/bombillosctrl/%0'.replace("%0", this.Luz2)).Send({}, function (Res){console.log(Res);});
};


//Class domotictrl
var instance;

function domotictrl ()
{
    Gwt.Gui.Window.call (this, "Domótica");


    var WIDTH = 640;
    var HEIGHT = 376;

    this.Layout = new Gwt.Gui.HBox(0);
    this.Col1 = new Gwt.Gui.VBox (0);
    this.Col2 = new Gwt.Gui.VBox (0);
    this.Title = new Gwt.Gui.StaticText ("Ventilador");
    this.PanelCtrlHead = new Gwt.Gui.Frame ();
    this.PanelCtrlHeadBox = new Gwt.Gui.VBox (0);
    this.PanelCtrlTilte = new Gwt.Gui.StaticText ("Panel De Control");
    this.VentiladorPanelCtrl = null;
    this.VentanasPanelCtrl = null;
    this.LuzPanelCtrl = null;
    this.PersianasPanelCtrl = null;
    this.VentiladorCtrl = new VentiladorCtrl ();
    this.VentanasCtrl = new VentanasCtrl ();
    this.LuzCtrl = new LuzCtrl ();
    this.PersianasCtrl = new PersianasCtrl ();
    this.EscenasCtrl = new EscenasCtrl ();

    this.SetSize (WIDTH, HEIGHT);
    this.SetPosition (Gwt.Gui.WIN_POS_CENTER);
    this.DisableMenu ();

    this.Layout.SetSize (this.GetAvailableWidth (), this.GetAvailableHeight());
    this.Add (this.Layout);

    this.Col1.SetBackgroundImage (Gwt.Core.Contrib.Images + "blurry_background2_33.png");
    this.Col1.SetBackgroundSize (Gwt.Gui.Contrib.BackgroundSize.Cover);
    this.Col1.SetAlignment (Gwt.Gui.ALIGN_CENTER);
    this.Layout.Add (this.Col1);

    this.Title.SetSize (320, 32);
    this.Title.SetExpand (false);
    this.Title.SetTextAlignment (Gwt.Gui.Contrib.TextAlign.Center);
    this.Title.SetMarginTop (25);
    this.Title.SetFontSize (20);
    this.Col1.Add (this.Title);

    this.Col2.SetBackgroundColor (new Gwt.Gui.Contrib.Color (50, 50, 50, 0.9));
    this.Layout.Add (this.Col2);

    this.PanelCtrlHead.SetExpand (true);
    this.PanelCtrlHead.SetHeight (56);
    this.PanelCtrlHead.SetBackgroundColor (new Gwt.Gui.Contrib.Color (40, 40, 45, 0.9));
    this.PanelCtrlHead.SetBorderColor (new Gwt.Gui.Contrib.Color (20, 20, 25, 0.9));
    this.PanelCtrlHead.SetBorder (1);
    this.PanelCtrlHead.SetBorderBottom (2);
    this.Col2.Add (this.PanelCtrlHead);

    this.PanelCtrlHeadBox.SetSize (this.PanelCtrlHead.GetWidth (), this.PanelCtrlHead.GetHeight ());
    this.PanelCtrlHead.Add (this.PanelCtrlHeadBox);

    this.PanelCtrlTilte.SetExpand (true);
    this.PanelCtrlTilte.SetTextAlignment (Gwt.Gui.Contrib.TextAlign.Center);
    this.PanelCtrlTilte.SetFontSize (16);
    this.PanelCtrlTilte.SetHeight (32);
    this.PanelCtrlTilte.SetMarginTop (10);
    this.PanelCtrlHeadBox.Add (this.PanelCtrlTilte);

    this.VentiladorPanelCtrl = new PanelItem (this.Col2.GetWidth(), 56, "Control De Ventilador", Gwt.Core.Contrib.Images + "appbar.fan.box.svg");
    this.VentiladorPanelCtrl.AddEvent (Gwt.Gui.Event.Mouse.Click, this.EventVentilador.bind(this));
    this.Col2.Add (this.VentiladorPanelCtrl);

    this.VentanasPanelCtrl = new PanelItem (this.Col2.GetWidth(), 56, "Control De Ventanas", Gwt.Core.Contrib.Images + "appbar.window.restore.svg");
    this.VentanasPanelCtrl.AddEvent (Gwt.Gui.Event.Mouse.Click, this.EventVentanas.bind(this));
    this.Col2.Add (this.VentanasPanelCtrl);

    this.LuzPanelCtrl = new PanelItem (this.Col2.GetWidth(), 56, "Control De Luz", Gwt.Core.Contrib.Images + "appbar.lightbulb.coil.svg");
    this.LuzPanelCtrl.AddEvent (Gwt.Gui.Event.Mouse.Click, this.EventLuz.bind(this));
    this.Col2.Add (this.LuzPanelCtrl);

    this.PersianasPanelCtrl = new PanelItem (this.Col2.GetWidth(), 56, "Control De Persianas", Gwt.Core.Contrib.Images + "appbar.map.folds.svg");
    this.PersianasPanelCtrl.AddEvent (Gwt.Gui.Event.Mouse.Click, this.EventPersianas.bind(this));
    this.Col2.Add (this.PersianasPanelCtrl);

    this.EscenasPanelCtrl = new PanelItem (this.Col2.GetWidth(), 56, "Escenas", Gwt.Core.Contrib.Images + "appbar.cog.svg");
    this.EscenasPanelCtrl.AddEvent (Gwt.Gui.Event.Mouse.Click, this.EventEscenas.bind(this));
    this.Col2.Add (this.EscenasPanelCtrl);

    this.Col1.Add (this.VentiladorCtrl);
    this.Col1.Add (this.VentanasCtrl);
    this.Col1.Add (this.LuzCtrl);
    this.Col1.Add (this.PersianasCtrl);
    this.Col1.Add (this.EscenasCtrl);

    this.EventVentilador();
}

domotictrl.prototype = new Gwt.Gui.Window ();
domotictrl.prototype.constructor = domotictrl;

domotictrl.prototype._app = function ()
{
    clearInterval (window.LuzCtrlMonitor);
};

domotictrl.prototype.EventVentilador = function ()
{
    this.Title.SetText ("Ventilador");
    this.HiddenAllCtrl ();
    this.VentiladorCtrl.SetDisplay (Gwt.Gui.Contrib.Display.Block);
};

domotictrl.prototype.EventVentanas = function ()
{
    this.Title.SetText ("Ventanas");
    this.HiddenAllCtrl ();
    this.VentanasCtrl.SetDisplay (Gwt.Gui.Contrib.Display.Block);
};

domotictrl.prototype.EventLuz = function ()
{
    this.Title.SetText ("Luz");
    this.HiddenAllCtrl ();
    this.LuzCtrl.SetDisplay (Gwt.Gui.Contrib.Display.Block);
};

domotictrl.prototype.EventPersianas = function ()
{
    this.Title.SetText ("Persianas");
    this.HiddenAllCtrl ();
    this.PersianasCtrl.SetDisplay (Gwt.Gui.Contrib.Display.Block);
};

domotictrl.prototype.EventEscenas = function ()
{
    this.Title.SetText ("Escenas");
    this.HiddenAllCtrl ();
    this.EscenasCtrl.SetDisplay (Gwt.Gui.Contrib.Display.Block);
};

domotictrl.prototype.HiddenAllCtrl = function ()
{
    this.VentiladorCtrl.SetDisplay (Gwt.Gui.Contrib.Display.None);
    this.VentanasCtrl.SetDisplay (Gwt.Gui.Contrib.Display.None);
    this.LuzCtrl.SetDisplay (Gwt.Gui.Contrib.Display.None);
    this.PersianasCtrl.SetDisplay (Gwt.Gui.Contrib.Display.None);
    this.EscenasCtrl.SetDisplay (Gwt.Gui.Contrib.Display.None);
};


return new function ()
{
    this.open = function ()
    {
        if (instance === undefined)
        {
            instance = new domotictrl ();
            instance.Open ();
        }
        else
        {
            console.log ("%app open".replace ("%app", instance.__proto__.constructor.name));
        }
    };

    this.close = function ()
    {
        if (instance !== undefined)
        {
            instance.Close ();
            instance = undefined;
        }
    };
};
})();
