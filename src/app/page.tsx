"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { PhoneCall, Mail } from "lucide-react";

export default function FmcsaChecker() {
  const [dotNumber, setDotNumber] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setError(null);
    setResult(null);

    if (!dotNumber.trim()) {
      setError("Por favor, ingrese un número USDOT.");
      return;
    }

    try {
      const response = await axios.get(
        `https://truckers-profit-backend-production.up.railway.app/api/verify/dot/${dotNumber}`,
        {
          headers: {
            "Authorization": "b7ceb4d8efc7968665fb0fdc246b7d49955c97b8"
          }
        }
      );

      const data = response.data.content || {};
      const carrier = data.carrier || {};

      setResult({
        dot: carrier.dotNumber,
        companyName: carrier.legalName,
        entityType: data.censusTypeDesc,
        address: `${carrier.phyStreet || ""} ${carrier.phyCity || ""}, ${carrier.phyState || ""} ${carrier.phyZipcode || ""}`,
        phone: carrier.phone || "No disponible",
        email: carrier.email || "No disponible",
        status: carrier.allowedToOperate === "Y" ? "Autorizado" : "No autorizado"
      });
    } catch (err) {
      setError("Error al consultar FMCSA. Verifique el DOT e intente nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/truckers-profit-logo.png"
            alt="Truckers Profit Logo"
            width={150}
            height={150}
          />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">FMCSA Checker</h1>
        <div className="flex space-x-2 mb-4">
          <input
            className="border rounded p-2 flex-grow"
            placeholder="Ingrese el USDOT"
            value={dotNumber}
            onChange={(e) => setDotNumber(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleCheck}
          >
            Verificar
          </button>
        </div>
        {result && (
          <div className="p-4 bg-green-50 border rounded-xl space-y-2">
            <div>
              <strong>USDOT:</strong> <span className="text-blue-700 font-bold">{result.dot}</span> <span className="text-green-600 font-medium">{result.status}</span>
            </div>
            {result.companyName && (
              <div><strong>Nombre:</strong> {result.companyName}</div>
            )}
            {result.entityType && (
              <div><strong>Tipo de Entidad:</strong> {result.entityType}</div>
            )}
            {result.address && (
              <div><strong>Dirección:</strong> {result.address}</div>
            )}
            <div><strong>Teléfono:</strong> {result.phone}</div>
            <div><strong>Correo electrónico:</strong> {result.email}</div>

            <div className="flex space-x-4 pt-4">
              {result.phone !== "No disponible" && (
                <a href={`tel:${result.phone}`} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded">
                  <PhoneCall className="w-4 h-4" /> <span>Call</span>
                </a>
              )}
              {result.email !== "No disponible" && (
                <a href={`mailto:${result.email}`} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                  <Mail className="w-4 h-4" /> <span>Send Email</span>
                </a>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
