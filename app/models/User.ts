//@ts-nocheck
// app/models/User.ts
import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    // Obavezni podaci
    ime: {
      type: String,
      required: [true, "Ime je obavezno"],
      trim: true,
    },
    prezime: {
      type: String,
      required: [true, "Prezime je obavezno"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email je obavezan"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Unesite validan email"],
    },
    password_hash: {
      type: String,
      required: [true, "Lozinka je obavezna"],
    },

    // Opcionalni podaci
    spol: {
      type: String,
      enum: ["muško", "žensko", "drugo", "ne želim reći", null],
      default: null,
    },
    datum_rodenja: {
      type: Date,
      default: null,
    },
    lokacija: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    // XP sistem
    xp_total: {
      type: Number,
      default: 0,
      min: 0,
    },
    xp_kategorije: {
      type: Map,
      of: Number,
      default: () =>
        new Map([
          ["Hrana", 0],
          ["Sport", 0],
          ["Urbano", 0],
          ["Priroda", 0],
          ["Povijest", 0],
          ["Kultura", 0],
          ["Misterija", 0],
          ["Zabava", 0],
        ]),
    },

    // Profilne informacije
    avatar: {
      type: String,
      default: "",
    },
    cover_slika: {
      type: String,
      default: "",
    },

    // Statistika
    ukupno_tura: {
      type: Number,
      default: 0,
    },
    ukupno_ocjena: {
      type: Number,
      default: 0,
    },
    prosjecna_ocjena: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Postavke
    postavke: {
      privatnost_profila: {
        type: String,
        enum: ["javno", "privatno", "samo pratitelji"],
        default: "javno",
      },
      email_obavijesti: {
        type: Boolean,
        default: true,
      },
      push_obavijesti: {
        type: Boolean,
        default: true,
      },
    },

    // Verifikacija
    email_verificiran: {
      type: Boolean,
      default: false,
    },
    verificiran_korisnik: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password_hash;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;

        // Konvertiraj Map u običan objekt
        if (ret.xp_kategorije instanceof Map) {
          ret.xp_kategorije = Object.fromEntries(ret.xp_kategorije);
        }

        return ret;
      },
    },
  },
);

// Virtualno polje za full name
UserSchema.virtual("puno_ime").get(function () {
  return `${this.ime} ${this.prezime}`;
});

export const User = models.User || model("User", UserSchema);
